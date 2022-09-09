module.exports = {
  content: ['./index.html', './src/**/!(tailwind).{js,jsx}'],
  theme: {},
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
