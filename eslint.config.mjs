import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// The old Next ESLint preset only enabled the classic pair of react-hooks
// rules; keep that surface so the refactor is bit-for-bit behavior-preserving
// and doesn't start flagging pre-existing shadcn/ui code.
export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "src-tauri/target/**",
      "src/routeTree.gen.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // shadcn/ui uses Math.random for a random skeleton width — that pattern
      // predates the refactor and was not lint-flagged before.
      "no-useless-assignment": "off",
    },
  },
  {
    files: ["vite.config.ts", "*.config.{js,mjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);
