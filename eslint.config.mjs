import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Import configs from eslintrc format
const nextConfig = compat.config({
  extends: ['next/core-web-vitals', 'next/typescript'],
});
const prettierConfig = compat.config({ extends: ['prettier'] });

const eslintConfig = [
  ...nextConfig,
  ...prettierConfig,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'build/**',
      'out/**',
      'dist/**',
      'coverage/**',
    ],
  },
];

export default eslintConfig;
