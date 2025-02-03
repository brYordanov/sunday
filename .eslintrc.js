module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules', 'coverage', 'build'],
  plugins: ['@typescript-eslint', 'prettier', 'import', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:@angular-eslint/recommended', // Angular rules
    'plugin:@angular-eslint/template/process-inline-templates',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error', // Enforce Prettier formatting
    '@typescript-eslint/explicit-function-return-type': 'off', // Too strict for Angular/NestJS
    '@typescript-eslint/no-explicit-any': 'warn', // Avoid `any`, but allow when necessary
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused vars, ignore `_` prefix
    '@typescript-eslint/no-inferrable-types': 'off', // Allow explicit types when preferred
    '@typescript-eslint/ban-ts-comment': 'warn', // Allow, but warn for TS comments
    '@angular-eslint/no-empty-lifecycle-method': 'off', // Allows empty lifecycle hooks
    '@angular-eslint/component-selector': [
      'error',
      { type: 'element', prefix: 'app', style: 'kebab-case' },
    ],
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        'alphabetize': { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-unresolved': 'off', // TypeScript handles module resolution
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'unused-imports/no-unused-imports': 'warn',
  },
  overrides: [
    {
      files: ['*.component.html'],
      parser: '@angular-eslint/template-parser',
      rules: {
        '@angular-eslint/template/no-negated-async': 'warn',
      },
    },
    {
      files: ['*.spec.ts', '*.test.ts'],
      env: {
        jest: true,
      },
      extends: ['plugin:jest/recommended'],
      plugins: ['jest'],
      rules: {
        '@typescript-eslint/no-empty-function': 'off', // Allow empty functions in tests
      },
    },
  ],
};
