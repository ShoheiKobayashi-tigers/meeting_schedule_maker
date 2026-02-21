import { Applicant, Sibling } from "../types/Students";
import { ScheduleData } from "../types/ScheduleManager";
import { sortDateCols, sortTimeRows } from "./sortUtils";

export interface AutoAssignmentResult {
  success: boolean;
  assignments: (string | null)[][];
  availability: string[][];
  unassigned: Applicant[];
}

export interface NodeInfo {
  prevKey: string | null;
  appId: string;
}

export function simulateAutoAssignment(
  applicants: Applicant[],
  siblings: Sibling[],
  scheduleData: ScheduleData,
  siblingSlotGap: number,
): AutoAssignmentResult {
  const { cols, rows } = scheduleData;
  let unassigned: Applicant[] = [];

  const sortedCols = sortDateCols(cols);
  const sortedRows = sortTimeRows(rows);

  const newAssignments = sortedRows.map((row) =>
    sortedCols.map((col) => {
      const origR = rows.indexOf(row);
      const origC = cols.indexOf(col);
      return scheduleData.assignments[origR][origC];
    }),
  );

  const newAvailability = sortedRows.map((row) =>
    sortedCols.map((col) => {
      const origR = rows.indexOf(row);
      const origC = cols.indexOf(col);
      return scheduleData.availability[origR][origC];
    }),
  );

  const getCoords = (slotKey: string) => {
    const [colStr, ...timeParts] = slotKey.split(" ");
    const timeStr = timeParts.join(" ");
    const c = sortedCols.indexOf(colStr);
    const r = sortedRows.indexOf(timeStr);
    return c !== -1 && r !== -1 ? { c, r } : null;
  };

  const isPreferred = (app: Applicant, c: number, r: number) => {
    const targetSlot = `${sortedCols[c]} ${sortedRows[r]}`;
    return app.preferred_dates.includes(targetSlot);
  };

  const isSlotAvailable = (c: number, r: number) => {
    if (r < 0 || r >= sortedRows.length || c < 0 || c >= sortedCols.length)
      return false;
    if (newAssignments[r][c] !== null) return false;
    if (
      newAvailability[r][c] === "admin_block" ||
      newAvailability[r][c] === "system_block"
    )
      return false;
    return true;
  };

  const isContinuous = (r1: number, r2: number, c: number) => {
    const minR = Math.min(r1, r2);
    const maxR = Math.max(r1, r2);
    for (let r = minR + 1; r < maxR; r++) {
      if (
        newAvailability[r][c] === "admin_block" ||
        newAvailability[r][c] === "system_block"
      ) {
        return false;
      }
    }
    return true;
  };

  for (let r = 0; r < sortedRows.length; r++) {
    for (let c = 0; c < sortedCols.length; c++) {
      const appId = newAssignments[r][c];
      if (appId) {
        const app = applicants.find((a) => a.id === appId);
        if (!app || !app.is_fixed) {
          newAssignments[r][c] = null;
        }
      }
    }
  }

  let targetApplicants = applicants.filter((a) => !a.is_fixed);

  // =========================================================================
  // 第1優先: 他クラス兄弟 (兄弟間専用の玉突きロジック搭載)
  // =========================================================================
  const siblingLinkedApplicants = targetApplicants.filter(
    (a) =>
      a.family_id &&
      siblings.some((s) => s.family_id === a.family_id && s.assigned_slot),
  );

  // 1. 各兄弟が「入れる枠」を事前にリストアップ
  const siblingCandidatesMap = new Map<string, { r: number; c: number }[]>();
  
  for (const app of siblingLinkedApplicants) {
    // ★ 修正1: この家族の「他クラス兄弟」の割り当て済み枠を【すべて】取得する
    const familySiblings = siblings.filter(
      (s) => s.family_id === app.family_id && s.assigned_slot
    );
    
    // ★ 修正2: 兄弟が既に使っている「列,行」のセットを作成
    const occupiedSlots = new Set<string>();
    let referenceCoords: { c: number; r: number } | null = null;

    for (const sib of familySiblings) {
      const coords = getCoords(sib.assigned_slot!);
      if (coords) {
        if (!referenceCoords) referenceCoords = coords; // 基準とする兄弟は最初の1人目
        occupiedSlots.add(`${coords.c},${coords.r}`);
      }
    }

    const candidates: { r: number; c: number }[] = [];
    if (referenceCoords) {
      const { c: sibC, r: sibR } = referenceCoords;
      for (
        let r = Math.max(0, sibR - siblingSlotGap);
        r <= Math.min(sortedRows.length - 1, sibR + siblingSlotGap);
        r++
      ) {
        // ★★★ 修正3: この家族の「どの兄弟」とも時間が被らないようにチェック ★★★
        if (occupiedSlots.has(`${sibC},${r}`)) continue;

        // 固定(is_fixed)以外で、条件を満たす枠をピックアップ
        if (
          newAssignments[r][sibC] === null &&
          newAvailability[r][sibC] !== "admin_block" &&
          newAvailability[r][sibC] !== "system_block" &&
          isPreferred(app, sibC, r) &&
          isContinuous(sibR, r, sibC)
        ) {
          candidates.push({ r, c: sibC });
        }
      }
      candidates.sort((a, b) => Math.abs(a.r - sibR) - Math.abs(b.r - sibR)); // 基準の枠に近い順
    }
    siblingCandidatesMap.set(app.id!, candidates);
  }

  // 2. 候補が少ない順（厳しい順）に並べ替え
  siblingLinkedApplicants.sort(
    (a, b) =>
      siblingCandidatesMap.get(a.id!)!.length -
      siblingCandidatesMap.get(b.id!)!.length,
  );

  // 3. 割り当て実行（ダメなら兄弟同士で玉突き）
  for (const app of siblingLinkedApplicants) {
    const candidates = siblingCandidatesMap.get(app.id!)!;
    let placed = false;

    // A. 普通に空いていれば入れる
    for (const cand of candidates) {
      if (newAssignments[cand.r][cand.c] === null) {
        newAssignments[cand.r][cand.c] = app.id!;
        placed = true;
        break;
      }
    }

    // B. 空いていなければ、兄弟同士で玉突き（BFS）
    if (!placed) {
      const parentMap: Record<string, NodeInfo> = {};
      const queue: {
        r: number;
        c: number;
        appId: string;
        prevKey: string | null;
      }[] = [];

      for (const cand of candidates) {
        const key = `${cand.r},${cand.c}`;
        parentMap[key] = { prevKey: null, appId: app.id! };
        queue.push({ r: cand.r, c: cand.c, appId: app.id!, prevKey: null });
      }

      let foundPath = false;
      let endSlot: { r: number; c: number } | null = null;

      while (queue.length > 0) {
        const current = queue.shift()!;
        const currKey = `${current.r},${current.c}`;

        if (newAssignments[current.r][current.c] === null) {
          endSlot = { r: current.r, c: current.c };
          foundPath = true;
          break;
        }

        const occupantId = newAssignments[current.r][current.c]!;
        // そこにいるのが「他の兄弟」なら、玉突きで動かせるか探す
        if (siblingLinkedApplicants.some((a) => a.id === occupantId)) {
          const occCandidates = siblingCandidatesMap.get(occupantId)!;
          for (const occCand of occCandidates) {
            const nextKey = `${occCand.r},${occCand.c}`;
            if (!(nextKey in parentMap)) {
              parentMap[nextKey] = { prevKey: currKey, appId: occupantId };
              queue.push({
                r: occCand.r,
                c: occCand.c,
                appId: occupantId,
                prevKey: currKey,
              });
            }
          }
        }
      }

      if (foundPath && endSlot) {
        let currKey: string | null = `${endSlot.r},${endSlot.c}`;
        while (currKey !== null) {
          const nodeInfo: NodeInfo = parentMap[currKey];
          if (!nodeInfo) break; // 型エラー防止の安全チェック

          const [r, c] = currKey.split(",").map(Number);
          newAssignments[r][c] = nodeInfo.appId; // 玉突き実行！
          currKey = nodeInfo.prevKey;
        }
        placed = true;
      }
    }

    if (!placed) unassigned.push(app); // 限界までやってダメなら諦める
    targetApplicants = targetApplicants.filter((a) => a.id !== app.id);
  }

  // =========================================================================
  // 第2優先: 最後枠指定 (is_last_slot)
  // =========================================================================
  const lastSlotApplicants = targetApplicants.filter((a) => a.is_last_slot);

  // ★ ユーザー様ご提案のルール1: 1人のlast_slotによって潰していいのは最大3枠まで
  const MAX_ALLOWED_BLOCKS = 3;

  for (const app of lastSlotApplicants) {
    let placed = false;
    const prefsByCol: Record<number, number[]> = {};
    for (const pref of app.preferred_dates) {
      const coords = getCoords(pref);
      if (coords) {
        if (!prefsByCol[coords.c]) prefsByCol[coords.c] = [];
        prefsByCol[coords.c].push(coords.r);
      }
    }

    for (const cStr of Object.keys(prefsByCol)) {
      const c = Number(cStr);
      const rowsForCol = prefsByCol[c].sort((a, b) => b - a); // 下から探索

      for (const r of rowsForCol) {
        if (isSlotAvailable(c, r)) {
          let canBeLast = true;
          let blockCount = 0;

          // 自分より下の枠をチェック
          for (let belowR = r + 1; belowR < sortedRows.length; belowR++) {
            if (newAssignments[belowR][c] !== null) {
              canBeLast = false;
              break;
            }
            // まだ誰もいない＆ブロックされていない有効な空き枠ならカウント
            if (
              newAvailability[belowR][c] !== "admin_block" &&
              newAvailability[belowR][c] !== "system_block"
            ) {
              blockCount++;
            }
          }

          if (canBeLast && blockCount <= MAX_ALLOWED_BLOCKS) {
            // ★ ユーザー様ご提案のルール2: システムブロック後の空き枠が未割当の人数を下回るかチェック

            // 現時点での全体の有効な空き枠を数える
            let totalAvailable = 0;
            for (let tr = 0; tr < sortedRows.length; tr++) {
              for (let tc = 0; tc < sortedCols.length; tc++) {
                if (isSlotAvailable(tc, tr)) totalAvailable++;
              }
            }

            // この配置を行ったあとの「残りの空き枠数」
            // (全体から、自分の1枠 ＋ 道連れにするblockCount を引く)
            const nextAvailableCount = totalAvailable - 1 - blockCount;

            // この後配置を待っている「残りの未割当の人数」
            // (targetApplicantsの残り人数(自分以外) ＋ すでに未割当になった人数)
            const remainingApplicantsCount =
              targetApplicants.length - 1 + unassigned.length;

            // 残りの空き枠が、未割当の人数を下回らない場合のみ許可！
            if (nextAvailableCount >= remainingApplicantsCount) {
              newAssignments[r][c] = app.id!;
              // 宣言通り、下をシステムブロック
              for (let belowR = r + 1; belowR < sortedRows.length; belowR++) {
                newAvailability[belowR][c] = "system_block";
              }
              placed = true;
              break;
            }
          }
        }
      }
      if (placed) break;
    }

    // 条件が厳しすぎて入れなかった場合は、キャンセル(未割当)になる
    if (!placed) unassigned.push(app);
    targetApplicants = targetApplicants.filter((a) => a.id !== app.id);
  }

  // =========================================================================
  // 第3優先: 同クラス双子
  // =========================================================================
  const familyGroups: Record<string, Applicant[]> = {};
  for (const app of targetApplicants) {
    if (app.family_id) {
      if (!familyGroups[app.family_id]) familyGroups[app.family_id] = [];
      familyGroups[app.family_id].push(app);
    }
  }

  for (const group of Object.values(familyGroups)) {
    if (group.length >= 2) {
      const [app1, app2] = group;
      let placed = false;
      for (let c = 0; c < sortedCols.length; c++) {
        for (let r = 0; r < sortedRows.length - 1; r++) {
          if (isSlotAvailable(c, r) && isSlotAvailable(c, r + 1)) {
            if (isPreferred(app1, c, r) && isPreferred(app2, c, r + 1)) {
              newAssignments[r][c] = app1.id!;
              newAssignments[r + 1][c] = app2.id!;
              placed = true;
              break;
            }
            if (isPreferred(app2, c, r) && isPreferred(app1, c, r + 1)) {
              newAssignments[r][c] = app2.id!;
              newAssignments[r + 1][c] = app1.id!;
              placed = true;
              break;
            }
          }
        }
        if (placed) break;
      }
      if (!placed) unassigned.push(app1, app2);
      targetApplicants = targetApplicants.filter(
        (a) => a.id !== app1.id && a.id !== app2.id,
      );
    }
  }

  // =========================================================================
  // 第4優先: 休憩指定
  // =========================================================================
  const gapApplicants = targetApplicants.filter((a) => a.needs_gap_after);
  for (const app of gapApplicants) {
    let placed = false;
    for (let c = 0; c < sortedCols.length; c++) {
      for (let r = 0; r < sortedRows.length - 1; r++) {
        if (
          isSlotAvailable(c, r) &&
          isSlotAvailable(c, r + 1) &&
          isPreferred(app, c, r)
        ) {
          newAssignments[r][c] = app.id!;
          newAvailability[r + 1][c] = "system_block";
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
    if (!placed) unassigned.push(app);
    targetApplicants = targetApplicants.filter((a) => a.id !== app.id);
  }

  // =========================================================================
  // 第5優先: その他一般 (貪欲法)
  // =========================================================================
  targetApplicants.sort(
    (a, b) => a.preferred_dates.length - b.preferred_dates.length,
  );
  const stillUnassigned: Applicant[] = [];

  for (const app of targetApplicants) {
    let placed = false;
    for (const pref of app.preferred_dates) {
      const coords = getCoords(pref);
      if (coords && isSlotAvailable(coords.c, coords.r)) {
        newAssignments[coords.r][coords.c] = app.id!;
        placed = true;
        break;
      }
    }
    if (!placed) stillUnassigned.push(app);
  }

  // =========================================================================
  // 第6優先 玉突き連鎖（一般生徒用）
  // =========================================================================
  const isMovable = (appId: string) => {
    const app = applicants.find((a) => a.id === appId);
    if (!app) return false;
    if (app.is_fixed || app.is_last_slot || app.needs_gap_after) return false;
    if (
      app.family_id &&
      siblings.some((s) => s.family_id === app.family_id && s.assigned_slot)
    )
      return false;
    if (
      app.family_id &&
      familyGroups[app.family_id] &&
      familyGroups[app.family_id].length >= 2
    )
      return false;
    return true;
  };

  const finalUnassigned: Applicant[] = [];

  for (const u_app of stillUnassigned) {
    let foundPath = false;
    let endSlot: { r: number; c: number } | null = null;
    const parentMap: Record<string, NodeInfo> = {};
    const queue: {
      r: number;
      c: number;
      appId: string;
      prevKey: string | null;
    }[] = [];

    for (const pref of u_app.preferred_dates) {
      const coords = getCoords(pref);
      if (
        coords &&
        newAvailability[coords.r][coords.c] !== "admin_block" &&
        newAvailability[coords.r][coords.c] !== "system_block"
      ) {
        const key = `${coords.r},${coords.c}`;
        parentMap[key] = { prevKey: null, appId: u_app.id! };
        queue.push({
          r: coords.r,
          c: coords.c,
          appId: u_app.id!,
          prevKey: null,
        });
      }
    }

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currKey = `${current.r},${current.c}`;

      if (newAssignments[current.r][current.c] === null) {
        endSlot = { r: current.r, c: current.c };
        foundPath = true;
        break;
      }

      const occupantId = newAssignments[current.r][current.c]!;
      if (isMovable(occupantId)) {
        const occupantApp = applicants.find((a) => a.id === occupantId)!;
        for (const pref of occupantApp.preferred_dates) {
          const nextCoords = getCoords(pref);
          if (
            nextCoords &&
            newAvailability[nextCoords.r][nextCoords.c] !== "admin_block" &&
            newAvailability[nextCoords.r][nextCoords.c] !== "system_block"
          ) {
            const nextKey = `${nextCoords.r},${nextCoords.c}`;
            if (!(nextKey in parentMap)) {
              parentMap[nextKey] = { prevKey: currKey, appId: occupantId };
              queue.push({
                r: nextCoords.r,
                c: nextCoords.c,
                appId: occupantId,
                prevKey: currKey,
              });
            }
          }
        }
      }
    }

    if (foundPath && endSlot) {
      let currKey: string | null = `${endSlot.r},${endSlot.c}`;
      while (currKey !== null) {
        const nodeInfo: NodeInfo = parentMap[currKey];
        if (!nodeInfo) break; // 型エラー防止の安全チェック

        const [r, c] = currKey.split(",").map(Number);
        newAssignments[r][c] = nodeInfo.appId;
        currKey = nodeInfo.prevKey;
      }
    } else {
      finalUnassigned.push(u_app);
    }
  }

  unassigned = [...unassigned, ...finalUnassigned];

  // =========================================================================
  // 結果を元の未ソート状態の配列順序に戻す
  // =========================================================================
  const finalAssignments = rows.map((row) =>
    cols.map((col) => {
      const sortR = sortedRows.indexOf(row);
      const sortC = sortedCols.indexOf(col);
      return newAssignments[sortR][sortC];
    }),
  );

  const finalAvailability = rows.map((row) =>
    cols.map((col) => {
      const sortR = sortedRows.indexOf(row);
      const sortC = sortedCols.indexOf(col);
      return newAvailability[sortR][sortC];
    }),
  );

  return {
    success: unassigned.length === 0,
    assignments: finalAssignments,
    availability: finalAvailability,
    unassigned,
  };
}
