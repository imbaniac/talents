module.exports = {
  content: ['./index.html', './src/**/!(tailwind).{js,jsx}'],
  theme: {},
  plugins: [require('daisyui')],
};
