module.exports = {
    printWidth: 80,
    semi: true,
    tabWidth: 4,
    trailingComma: "all",
    importOrder: ["<THIRD_PARTY_MODULES>", "^@APP/(.*)$", "^[./]"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ["decorators-legacy", "typescript"],
};
