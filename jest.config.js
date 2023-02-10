/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    clearMocks: true,
    collectCoverageFrom: ['API/**/*.ts', 'components/**/*.ts', 'pages/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/'],
    coverageReporters: ['lcov', 'text', 'cobertura'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    moduleNameMapper: {
        '^react($|/.+)': '<rootDir>/node_modules/react$1',
    },
    setupFiles: ['./jest-shim.ts'],
    setupFilesAfterEnv: ['./jest-setup.ts', 'jest-extended/all',],
    testMatch: ['**/?(*-test).ts?(x)', '**/?(*).test.ts?(x)'],
    testPathIgnorePatterns: ['/target/', '/node_modules/'],
};
