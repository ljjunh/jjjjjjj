/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.vue', 'index.html'],
  theme: {
    extend: {
      flexGrow: {
        1: 1,
        4: 4,
        6: 6,
      },
      flex: {
        3: '3 3 0%',
      },
      colors: {
        'regal-blue': '#e8f0fe',
      },
      inset: {
        '500px': '500px',
        '550px': '550px',
        '560px': '560px',
      },
      screens: {
        // 커스텀 브레이크포인트 추가
        'custom-min-width': '30rem',
      },
    },
    variants: {
      extend: {
        inset: ['peer-checked'],
      },
    },
  },
  plugins: [],
};
