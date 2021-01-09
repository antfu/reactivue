export default {
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['./setupTests.ts'],
}
