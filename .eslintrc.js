const OFF = 0;
const ERROR = 2;
module.exports = {
  root: true,
  extends: [
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
  ],
  env: {
      node: true,
      browser: true,
      es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
      sourceType: 'module',
      project: ['./tsconfig.eslint.json'],
      tsconfigRootDir: __dirname,
  },
  plugins: [
      '@typescript-eslint',
      'prettier',
      'react-hooks',
  ],
  rules: {
      quotes: [
          ERROR,
          'single',
          {
              allowTemplateLiterals: true,
              avoidEscape: true,
          },
      ],
      '@typescript-eslint/no-var-requires': OFF,
      '@typescript-eslint/no-empty-function': OFF,
      '@typescript-eslint/no-unused-vars': [
          ERROR,
          {
              argsIgnorePattern: '^_',
              varsIgnorePattern: '^_',
              caughtErrorsIgnorePattern: '^_',
          },
      ]
  },
}