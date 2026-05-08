import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/vscode.d.ts", "**/vscode.proposed.d.ts", "client/out/**", "server/out/**", "**/*.config.{mjs,js}"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
			"no-control-regex": "off",
        },
    },
    {
        files: ["scripts/**/*.js"],
        languageOptions: {
            globals: {
                require: "readonly",
                module: "readonly",
                exports: "writable",
                process: "readonly",
                console: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                Buffer: "readonly",
            },
            sourceType: "commonjs",
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    }
);
