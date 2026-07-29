import type { Config } from 'tailwindcss';

/** Baut eine Farbe aus RGB-Kanaelen, damit Transparenzen wie bg-primary/10 gehen. */
const kanal = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './packages/ui/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: kanal('--bg'),
          subtle: kanal('--bg-subtle'),
        },
        surface: {
          DEFAULT: kanal('--surface'),
          raised: kanal('--surface-raised'),
        },
        border: {
          DEFAULT: kanal('--border'),
          strong: kanal('--border-strong'),
        },
        fg: {
          DEFAULT: kanal('--fg'),
          muted: kanal('--fg-muted'),
          subtle: kanal('--fg-subtle'),
          onPrimary: kanal('--fg-on-primary'),
        },
        // Primaer erscheint nur als gefuellte Flaeche, nie als Warnhinweis.
        primary: {
          DEFAULT: kanal('--primary'),
          hover: kanal('--primary-hover'),
          active: kanal('--primary-active'),
          subtle: kanal('--primary-subtle'),
          border: kanal('--primary-border'),
        },
        success: {
          DEFAULT: kanal('--success'),
          bg: kanal('--success-bg'),
          border: kanal('--success-border'),
        },
        warning: {
          DEFAULT: kanal('--warning'),
          bg: kanal('--warning-bg'),
          border: kanal('--warning-border'),
        },
        danger: {
          DEFAULT: kanal('--danger'),
          bg: kanal('--danger-bg'),
          border: kanal('--danger-border'),
        },
        info: {
          DEFAULT: kanal('--info'),
          bg: kanal('--info-bg'),
          border: kanal('--info-border'),
        },
        // Lernstatus: nie alleiniger Traeger -> immer zusaetzlich Symbol + Label
        status: {
          neu: kanal('--status-neu'),
          teil: kanal('--status-teil'),
          falsch: kanal('--status-falsch'),
          fertig: kanal('--status-fertig'),
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      fontSize: {
        caption: ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.01em' }],
        overline: [
          '0.75rem',
          { lineHeight: '1rem', letterSpacing: '0.06em', fontWeight: '600' },
        ],
        'body-sm': ['0.875rem', { lineHeight: '1.375rem' }],
        label: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        body: ['1rem', { lineHeight: '1.5rem' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        h4: ['1.125rem', { lineHeight: '1.625rem', fontWeight: '600' }],
        h3: [
          '1.25rem',
          { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.01em' },
        ],
        h2: [
          '1.5rem',
          { lineHeight: '2rem', fontWeight: '600', letterSpacing: '-0.01em' },
        ],
        h1: [
          '1.875rem',
          { lineHeight: '2.25rem', fontWeight: '700', letterSpacing: '-0.02em' },
        ],
        display: [
          '2.25rem',
          { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em' },
        ],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      spacing: {
        touch: '48px', // Mindest-Beruehrungsziel
      },
      maxWidth: {
        lese: '42rem', // ca. 68 Zeichen
        formular: '32rem',
        campus: '64rem',
        daten: '90rem',
      },
      ringColor: { DEFAULT: 'rgb(var(--ring))' },
      ringWidth: { DEFAULT: '3px' },
      transitionDuration: { DEFAULT: '150ms' },
    },
  },
  plugins: [],
};

export default config;
