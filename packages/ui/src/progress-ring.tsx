import * as React from 'react';

export interface ProgressRingProps {
  /** 0 bis 100. */
  value: number;
  size?: number;
  /** Wird Screenreadern vorgelesen. Ohne Angabe der Prozentwert. */
  label?: string;
}

export function ProgressRing({ value, size = 64, label }: ProgressRingProps) {
  const sicher = Math.min(100, Math.max(0, value));
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (sicher / 100) * c;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="progressbar"
      aria-valuenow={Math.round(sicher)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${Math.round(sicher)}%`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgb(var(--border))"
        strokeWidth={7}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgb(var(--primary))"
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="52%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size * 0.26}
        fontWeight={700}
        fill="rgb(var(--fg))"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {Math.round(sicher)}%
      </text>
    </svg>
  );
}
