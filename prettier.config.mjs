/** @type import("prettier").Config */
const PRETTIER_CONFIG = {
    printWidth: 80,
    semi: true,
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'all',
    plugins: ['@trivago/prettier-plugin-sort-imports'],
    importOrder: [
        '<THIRD_PARTY_MODULES>',
        '@PRISMA',
        '^@SRC/(.*)$',
        '^@TEST/(.*)$',
        '^[./]',
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ['decorators-legacy', 'typescript'],
};

export default PRETTIER_CONFIG;
