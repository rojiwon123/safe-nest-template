/** @type import("prettier").Config */
const PRETTIER_CONFIG = {
    printWidth: 140,
    semi: true,
    tabWidth: 4,
    trailingComma: "all",
    experimentalTernaries: true,
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    importOrder: ["<THIRD_PARTY_MODULES>", "@PRISMA", "^@/(.*)$", "^[./]"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ["decorators-legacy", "typescript"],
};

export default PRETTIER_CONFIG;
