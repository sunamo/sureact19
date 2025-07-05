module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          lib: ['dom', 'dom.iterable', 'esnext'],
          isolatedModules: true,
        },
      },
    ],
  },
  testMatch: ['<rootDir>/src/**/*.test.(ts|tsx)', '<rootDir>/test/**/*.test.(ts|tsx)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/index.ts'],
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Ensure Jest ignores JavaScript files and only uses TypeScript
  // přidám i js, nevadí to protože jsou ignorovány přes moduleFileExtensions. jest to ale takto vyžaduje
  moduleFileExtensions: ['ts', 'tsx', 'json', 'js', 'jsx'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '\\.js$', '\\.js\\.map$'],
  // Explicitly exclude .js files from being resolved
  modulePathIgnorePatterns: ['<rootDir>/lib/', '\\.js$'],
  // Force Jest to resolve .ts files first
  extensionsToTreatAsEsm: [],
  resolver: undefined,
};
