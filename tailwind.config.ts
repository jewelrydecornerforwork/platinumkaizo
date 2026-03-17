import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#030712',
        },
        emerald: {
          500: '#10B981',
        },
      },
      backdropFilter: {
        'blur-md': 'blur(12px)',
      },
      spacing: {
        sidebar: '280px',
      },
    },
  },
  plugins: [],
};

export default config;
