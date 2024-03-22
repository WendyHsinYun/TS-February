module.exports = {
  env: {
    browser: true,
    es2023: true,
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'no-undef': 'off',
  },
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
  },
};
