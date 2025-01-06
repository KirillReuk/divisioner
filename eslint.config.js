import js from '@eslint/js'
import globals from 'globals'

export default {
  ignores: ['dist'],
  extends: [
    js.configs.recommended,
    'plugin:@typescript-eslint/recommended',  // Include TypeScript specific rules
    'plugin:react/recommended',  // React recommended rules
    'plugin:react-hooks/recommended',  // React hooks rules
    'plugin:prettier/recommended',  // Integrate Prettier for code formatting
  ],
  parser: '@typescript-eslint/parser',  // Use the TypeScript parser for ESLint
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json', // Reference to your TypeScript config
  },
  plugins: [
    'react-hooks',
    'react-refresh',
    '@typescript-eslint',
    'prettier',  // For running Prettier within ESLint
  ],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  rules: {
    // React hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',  // Recommended hook rules

    // React-specific rules
    'react/prop-types': 'off',  // TypeScript handles type checking
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // TypeScript rules
    '@typescript-eslint/no-explicit-any': 'warn',  // Avoid 'any'
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',  // Optional: Allow function return types to be inferred
    '@typescript-eslint/explicit-function-return-type': 'off',

    // Prettier integration (make sure Prettier formatting is applied)
    'prettier/prettier': 'error',

    // General good practices
    'eqeqeq': ['error', 'always'],  // Always use strict equality (===)
    'no-console': 'warn',  // Warn about console.log
  },
}
