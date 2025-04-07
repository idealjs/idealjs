import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {}],
      "@typescript-eslint/no-empty-object-type": ["off", {}],
      "prefer-const": ["warn", {}],
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      "react/jsx-no-leaked-render": "warn",
    },
  },
];

export default eslintConfig;
