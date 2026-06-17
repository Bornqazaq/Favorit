/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Все цвета берутся из CSS-переменных в src/index.css
        brand:              'var(--color-brand)',
        brandAccent:        'var(--color-brand-accent)',
        brandHover:         'var(--color-brand-hover)',
        brandMuted:         'var(--color-brand-muted)',
        brandMutedBorder:   'var(--color-brand-muted-border)',
        onBrand:            'var(--color-on-brand)',

        accentBlue:   'var(--color-accent-blue)',
        accentOrange: 'var(--color-accent-orange)',

        bgMain:     'var(--color-bg-main)',
        bgCard:     'var(--color-bg-card)',
        bgElevated: 'var(--color-bg-elevated)',
        bgSurface:  'var(--color-bg-surface)',
        bgGlass:    'var(--color-bg-glass)',

        textMain:  'var(--color-text-main)',
        textMuted: 'var(--color-text-muted)',
        textFaint: 'var(--color-text-faint)',

        borderColor:  'var(--color-border)',
        borderBright: 'var(--color-border-bright)',

        imgBg:        'var(--color-img-bg)',
        overlay:      'var(--color-overlay)',
        whatsapp:     'var(--color-whatsapp)',
        whatsappHover:'var(--color-whatsapp-hover)',
        gis:          'var(--color-gis)',
        gisHover:     'var(--color-gis-hover)',
      },
    },
  },
  plugins: [],
}
