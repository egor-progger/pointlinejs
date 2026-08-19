import js from '@eslint/js';
import path from "path";
import { fileURLToPath } from "url";
import TypescriptEslint from "@typescript-eslint/eslint-plugin";
import Prettier from "eslint-plugin-prettier";
import SimpleImportSort from "eslint-plugin-simple-import-sort";
import Import from "eslint-plugin-import";
import Jsdoc from "eslint-plugin-jsdoc";
import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import { FlatCompat } from "@eslint/eslintrc";
import { fixupPluginRules, fixupConfigRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const compatWithRecommended = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
  });
export default defineConfig([
  globalIgnores(["/node_modules","/dist","pointlinejs*.tgz","documentation/api"]),
  {
    plugins: {
      "@typescript-eslint": fixupPluginRules(TypescriptEslint),
      prettier: fixupPluginRules(Prettier),
      "simple-import-sort": fixupPluginRules(SimpleImportSort),
      import: fixupPluginRules(Import),
      jsdoc: fixupPluginRules(Jsdoc)
    },
  },
  {
    files: ["*.ts"],
    extends: fixupConfigRules(compatWithRecommended.extends([
      js.configs.recommended,
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended"
    ])),
    languageOptions: {
      parserOptions: {
        project: ["tsconfig.json"],
        createDefaultProgram: true
      }
    },
    rules: {
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/naming-convention": [
          "error",
          {
            "selector": "default",
            "format": ["camelCase"],
            "leadingUnderscore": "allow",
            "trailingUnderscore": "allow"
          },
          {
            "selector": "variable",
            "format": ["camelCase", "UPPER_CASE"],
            "leadingUnderscore": "allow",
            "trailingUnderscore": "allow"
          },
          {
            "selector": "typeLike",
            "format": ["PascalCase"]
          },
          {
            "selector": "enumMember",
            "format": ["PascalCase"]
          }
        ],
      "complexity": "error",
      "max-len": [
          "error",
          {
            "code": 140
          }
        ],
      "no-new-wrappers": "error",
      "no-throw-literal": "error",
      "import/no-unresolved": "off",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
          "error",
          {
            "groups": [
              ["^\\u0000"],
              ["^@?(?!app)\\w"],
              ["^@app?\\w"],
              ["^[^.]"],
              ["^\\."]
            ]
          }
        ],
      "sort-imports": "off",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "no-invalid-this": "off",
      "@typescript-eslint/no-invalid-this": ["warn"],
      "@typescript-eslint/explicit-function-return-type": ["error"],
      "no-constant-binary-expression": 'off',
      "no-empty-static-block": 'off',
      "no-new-native-nonconstructor": 'off',
      "no-unused-private-class-members": 'off'
    },
  }
]);
