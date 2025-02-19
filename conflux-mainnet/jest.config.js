module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tests/tsconfig.json'
        }
    }
};