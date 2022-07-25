const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['src/client/**/*.tsx', 'src/client/**/*.ts'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        '3xl': '2000px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
