module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react', 'eslint-config-prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 0,
    'import/prefer-default-export': 0,
    'react/jsx-filename-extension': 0,
    'no-nested-ternary': 1,
    'global-require': 0,
    'react/destructuring-assignment': 0,
  },
};
