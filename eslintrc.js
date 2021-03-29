module.exports = {  
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },  
  globals: {
    AMap: true,
    wx: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'no-unused-vars': ['warn'],
    'semi': ['error', 'never'],
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}