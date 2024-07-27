import { includeIgnoreFile } from '@eslint/compat';
import deprecation from 'eslint-plugin-deprecation';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default tseslint.config(
    ...tseslint.configs.recommended,
    {
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            deprecation,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: { project: ['tsconfig.json'] },
        },
        rules: {
            // typescript rules
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-namespace': 'off',

            // extension rules
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-throw-literal': 'error',
            '@typescript-eslint/no-unused-vars': 'warn',
            'deprecation/deprecation': 'error',
        },
    },
    { ignores: includeIgnoreFile(gitignorePath).ignores },
);
