import React from 'react';
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldInput,
  NumberFieldIncrement,
} from "@/components/reui/number-field";
import { Minus, Plus } from 'lucide-react';

export function ResponseCountField({
  value,
  onChange,
  min,
  max
}) {
  const numericValue = Number(value) || min;

  return (
    <NumberField 
      value={numericValue} 
      onValueChange={(val) => {
        if (val !== null && val !== undefined && !isNaN(val)) {
          onChange(val);
        }
      }}
      min={min}
      max={max}
      style={{ width: '96px', flexShrink: 0 }}
    >
      <NumberFieldGroup style={{
        height: '28px',
        width: '96px',
        borderRadius: '7px',
        border: '1px solid var(--kt-input-border)',
        background: 'var(--kt-input-bg)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)'
      }}>
        <NumberFieldDecrement style={{
          height: '100%',
          padding: '0 6px',
          color: 'var(--kt-muted)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          transition: 'all 0.15s ease'
        }}>
          <Minus size={12} />
        </NumberFieldDecrement>

        <NumberFieldInput style={{
          width: '32px',
          height: '100%',
          textAlign: 'center',
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 700,
          fontSize: '12px',
          color: 'var(--kt-heading)',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          padding: 0
        }} />

        <NumberFieldIncrement style={{
          height: '100%',
          padding: '0 6px',
          color: 'var(--kt-muted)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          transition: 'all 0.15s ease'
        }}>
          <Plus size={12} />
        </NumberFieldIncrement>
      </NumberFieldGroup>
    </NumberField>
  );
}
