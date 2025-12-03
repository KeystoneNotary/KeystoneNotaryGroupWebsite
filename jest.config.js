const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!(gsap|@gsap/react|lucide-react)/)",
  ],
  moduleNameMapper: {
    "^gsap/(.*)$": "<rootDir>/node_modules/gsap/dist/$1",
    "^gsap$": "<rootDir>/node_modules/gsap/dist/gsap.js",
  },
  testPathIgnorePatterns: [
    "<rootDir>/_legacy_backup/",
    "<rootDir>/node_modules/",
    "<rootDir>/__tests__/",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
