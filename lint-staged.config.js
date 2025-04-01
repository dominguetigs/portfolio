module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'eslint --config eslint.config.mjs --fix',
    'prettier --write',
  ],
  '*.{json,css,md}': ['prettier --write'],
};
