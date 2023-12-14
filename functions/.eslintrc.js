module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-base-to-string': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/return-await': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/prefer-ts-expect-error': 0,
    'array-callback-return': 0,
    'eslint-disable-next-line': 0,
    'prefer-regex-literals': 0,
    semi: 'warn',
    'max-len': [
      'error',
      {
        code: 120,
      },
    ],
  },
};
