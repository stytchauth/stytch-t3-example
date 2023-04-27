module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  jsxSingleQuote: true,
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindConfig: 'tailwind.config.cjs',
};
