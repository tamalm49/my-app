import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'var/**']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  },
  {
    files: ['public/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  {
    files: ['**/*.js'],
    rules: {
      ...js.configs.recommended.rules
    }
  },
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'consistent-return': 'error',
      curly: ['error', 'all'],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-duplicate-imports': 'error',
      'no-param-reassign': [
        'error',
        { props: true, ignorePropertyModificationsFor: ['req', 'res', 'ctx'] }
      ]
    }
  },
  eslintConfigPrettier
);
