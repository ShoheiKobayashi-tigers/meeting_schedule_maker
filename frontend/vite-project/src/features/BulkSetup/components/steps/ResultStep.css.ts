import { style } from "@vanilla-extract/css";
import { vars } from "../../../../styles/vars.css";

// layout.css.ts に任せる container, header, title, description 等は削除しました

export const formGrid = style({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  marginBottom: "32px",
  padding: `0 ${vars.space.large}`, // スクロールエリア内の左右余白
});

export const label = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.small,
  fontSize: "0.9rem",
  fontWeight: "bold",
  color: vars.color.textPrimary,
});

export const input = style({
  padding: "12px 16px",
  borderRadius: vars.borderRadius.small,
  border: `1px solid ${vars.color.border}`,
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  backgroundColor: vars.color.white,
  ":focus": {
    outline: "none",
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.primary}1a`,
  },
});

export const textarea = style([
  input,
  {
    resize: "vertical",
    lineHeight: "1.6",
    minHeight: "120px",
  },
]);

// --- ダウンロードエリア（BulkSetupHubへの依存を断ち切り、ここで独立定義） ---
export const downloadArea = style({
  backgroundColor: "#f8fafc",
  borderRadius: vars.borderRadius.medium,
  padding: "32px",
  textAlign: "center",
  margin: `0 ${vars.space.large} 32px`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
});

export const statusBadge = style({
  padding: "6px 16px",
  borderRadius: "20px",
  backgroundColor: vars.color.white,
  color: "#0284c7",
  fontSize: "0.85rem",
  fontWeight: "800",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  display: "inline-block",
});

export const downloadIcon = style({
  fontSize: "48px",
  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
});