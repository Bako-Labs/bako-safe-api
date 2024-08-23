module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off', // Turn off "native" TS rule
    '@typescript-eslint/explicit-module-boundary-types': ['off'], // Allow inferred function return type
    '@typescript-eslint/no-unused-vars': ['off'], // Enable TS no unused var role
    '@typescript-eslint/no-explicit-any': ['warn'], // Block "any" as a type
  },
  ignorePatterns: ['node_modules'],
};
