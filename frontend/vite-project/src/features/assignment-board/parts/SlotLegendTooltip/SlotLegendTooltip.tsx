// src/features/assignment-board/parts/SlotLegendTooltip/SlotLegendTooltip.tsx
import React from 'react';
import { HelpCircle } from 'lucide-react';
import * as s from './SlotLegendTooltip.css';

export const SlotLegendTooltip: React.FC = () => {
  return (
    <div className={s.tooltipContainer}>
      <HelpCircle size={20} color="#a0aec0" />
      
      <div className={s.tooltipContent}>
        <div className={s.tooltipHeader}>枠・カードの色の意味</div>
        
        <div className={s.tooltipRow}>
          <div className={s.colorBoxSelected}></div>
          <span>選択中/ドラッグ中</span>
        </div>
        
        <div className={s.tooltipRow}>
          <div className={s.colorBoxMovable}></div>
          <span>割り当て・移動・交換可能</span>
        </div>
        
        <div className={s.tooltipRow}>
          <div className={s.colorBoxPreferred}></div>
          <span>希望しているが交換不可</span>
        </div>

        <div className={s.tooltipRow}>
          <div className={s.colorBoxBlock}></div>
          <span>割り当て不可</span>
        </div>
      </div>
    </div>
  );
};