import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

const sizeRules = {
  'max-lines-per-function': ['error', { max: 14, skipBlankLines: true, skipComments: true }],
  'max-lines': ['error', { max: 400, skipBlankLines: false, skipComments: false }],
  'max-depth': ['error', 3],
  'max-params': ['error', 4],
  complexity: ['error', 8],
};

const styleRules = {
  'no-var': 'error',
  'prefer-const': 'error',
  eqeqeq: ['error', 'always'],
  'no-console': ['warn', { allow: ['warn', 'error'] }],
};

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'legacy/', 'public/'] },
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { ...sizeRules, ...styleRules },
  },
  { files: ['tools/**'], rules: { 'no-console': 'off' } },
];
