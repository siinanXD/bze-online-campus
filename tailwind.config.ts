import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './packages/ui/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neutrale Grundfläche + genau eine Akzentfarbe für Primäraktionen
        bg: 'hsl(var(--bg))',
        surface: 'hsl(var(--surface))',
        border: 'hsl(var(--border))',
        fg: 'hsl(var(--fg))',
        muted: 'hsl(var(--muted))',
        accent: { DEFAULT: 'hsl(var(--accent))', fg: 'hsl(var(--accent-fg))' },
        // Grün/Rot AUSSCHLIESSLICH für Lernstatus (nie alleiniger Träger -> immer + Symbol/Label)
        status: {
          neu: 'hsl(var(--status-neu))',
          teil: 'hsl(var(--status-teil))',
          falsch: 'hsl(var(--status-falsch))',
          fertig: 'hsl(var(--status-fertig))',
        },
      },
      borderRadius: { xl: '0.9rem', '2xl': '1.2rem' },
      spacing: { touch: '48px' }, // Mindest-Berührungsziel
      fontFamily: { sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'] },
    },
  },
  plugins: [],
};
export default config;
