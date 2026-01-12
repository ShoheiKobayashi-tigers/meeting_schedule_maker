// src/components/ui/SelectField/SelectField.tsx
import React from 'react';
import * as s from './SelectField.css';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SelectField: React.FC<Props> = ({ options, value, onChange, placeholder }) => {
  return (
    <div className={s.wrapper}>
      <select 
        className={s.select} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};