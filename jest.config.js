module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
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
  testMatch: [
    '<rootDir>/src/**/*.test.(ts|tsx|js|jsx)',
    '<rootDir>/test/**/*.test.(ts|tsx|js|jsx)',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/index.ts'],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
