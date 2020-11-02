module.exports = {
  env: {
    browser: true,
  },
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "airbnb-typescript/base",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  plugins: [
    "prettier",
    "@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: {
    "prettier/prettier": ["error", { singleQuote: true }],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": ["error", { "ignoreRestArgs": true }],
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/prefer-interface": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "import/prefer-default-export": 0,
    "import/no-default-export": 2,
    "class-methods-use-this": 0,
    "func-names": 0,
    "import/no-dynamic-require": 0,
    "global-require": 0,
    "no-plusplus": 0,
    "no-new": 0,
    "new-cap": 0,
    "no-restricted-syntax": 0,
  }
};
