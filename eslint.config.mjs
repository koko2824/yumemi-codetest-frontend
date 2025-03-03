import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".nuxt/**",
      ".astro/**",
      "build/**",
      "dist/**",
      "out/**",
      "public/**",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "vite.config.ts",
      "next.config.js",
      "tsconfig.json",
      "src/env.d.ts",
      "*.cjs",
      "*.mjs"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
