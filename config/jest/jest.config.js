module.exports = {
  rootDir: "../../",

  testEnvironment: "node",
  testPathIgnorePatterns: [
    // Ignore the "helper" files inside "__tests__" folders.
    '/__tests__/functional/helper',
    '/__tests__/unit/helper',
  ],

  verbose: false,

  // "axios-api-doc-generator" related.
  globalSetup: "<rootDir>/config/jest/global-setup.js",
  globalTeardown: "<rootDir>/config/jest/global-teardown.js",
  setupTestFrameworkScriptFile: "<rootDir>/config/jest/setup-test-framework-script-file.js"
};