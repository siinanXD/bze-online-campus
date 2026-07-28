import * as React from 'react';

/**
 * Schlichte Strichsymbole für Tableiste und Kopfzeile.
 * Farbe ist nie alleiniger Träger: jedes Icon steht immer neben einem Textlabel
 * (Tableiste) oder einem aria-label (Kopfzeile).
 */
export type ShellIconProps = React.SVGProps<SVGSVGElement> & { active?: boolean };

function base(props: ShellIconProps) {
  const { active, ...rest } = props;
  return {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: active ? 2.25 : 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...rest,
  };
}

export function StartIcon(props: ShellIconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-5.5a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2V20h3.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function LernenIcon(props: ShellIconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 0 2.5-2.5v-13Z" />
    </svg>
  );
}

export function PruefungIcon(props: ShellIconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3.5h6a1 1 0 0 1 1 1V6H8V4.5a1 1 0 0 1 1-1Z" />
      <path d="m9 13 2 2 4-4" />
    </svg>
  );
}

export function BerichtIcon(props: ShellIconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 3.5h7L18.5 8V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M8.5 12.5h7M8.5 16h4.5" />
    </svg>
  );
}

export function MehrIcon(props: ShellIconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="5.5" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ProfilIcon(props: ShellIconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5 20c.8-3.6 3.6-5.75 7-5.75S18.2 16.4 19 20" />
    </svg>
  );
}
