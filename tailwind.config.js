/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        qidian: {
          bg: '#f6f1e7',
          text: '#262626',
          gray: '#666666',
          lightGray: '#999999',
          border: '#e6e0d0',
          red: '#bf2c24',
          hover: '#f0e6d6',
          panel: '#fbf6ec',
        }
      },
      fontFamily: {
        serif: ['"KaiTi"', '"STKaiti"', '"Georgia"', 'serif'],
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        'panel': '0 2px 8px rgba(0,0,0,0.05)',
      }
    }
  },
  plugins: [],
}
