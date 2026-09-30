const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    // not covered by the preset's test-file globs
    files: ['jest.setup.js'],
    languageOptions: { globals: { jest: 'readonly' } },
  },
  {
    ignores: ['dist/*', 'coverage/*'],
  },
]);
