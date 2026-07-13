const js = require("./backend/node_modules/@eslint/js");

module.exports = [
  {
    ignores: ["backend/node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["backend/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        Buffer: "readonly",
        console: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
        __dirname: "readonly",
        setInterval: "readonly"
      }
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  },
  {
    files: ["frontend/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        CustomEvent: "readonly",
        csrfFetch: "readonly",
        FormData: "readonly",
        Headers: "readonly",
        URL: "readonly",
        console: "readonly",
        document: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        window: "readonly"
      }
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["error", { "varsIgnorePattern": "^(csrfFetch)$" }]
    }
  },
  {
    files: ["frontend/security.js"],
    rules: {
      "no-redeclare": "off"
    }
  }
];
