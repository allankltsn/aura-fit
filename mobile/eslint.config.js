const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  ...expoConfig,
  {
    rules: {
      // XSS/security guardrails — this app renders on web via react-native-web,
      // so web-only footguns (raw HTML injection, reverse tabnabbing) still apply.
      'react/no-danger': 'error',
      'react/jsx-no-target-blank': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',

      // Clean code / consistency
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  prettierConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'scripts/*'],
  },
]);
