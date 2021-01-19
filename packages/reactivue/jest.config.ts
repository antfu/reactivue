export default {
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./setupTests.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
    __DEV__: true,
    __BROWSER__: true,
  },
}
