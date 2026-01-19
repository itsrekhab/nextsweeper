import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import i18nJsonPlugin from "eslint-plugin-i18n-json";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["./messages/*.json"],
    plugins: { "i18n-json": i18nJsonPlugin },
    processor: {
      meta: { name: ".json" },
      ...i18nJsonPlugin.processors[".json"],
    },
    rules: {
      ...i18nJsonPlugin.configs.recommended.rules,
      "i18n-json/valid-message-syntax": "off",
      "i18n-json/identical-keys": [
        2,
        {
          filePath: path.resolve("./messages/en.json"),
        },
      ],
    },
  },
]);

export default eslintConfig;
