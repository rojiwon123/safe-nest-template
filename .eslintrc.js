module.exports = {
    root: true,
    plugins: ["@typescript-eslint"],
    extends: ["plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    ignorePatterns: [".eslintrc.js", "*.config.js"],
    rules: {
        // typescript rules
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-namespace": "off",

        // extension rules
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-throw-literal": "error",
        "@typescript-eslint/no-unused-vars": "error",
    },
};
