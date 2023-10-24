const config = {
  preset: 'jest-puppeteer',
  collectCoverageFrom: [
    'src/**/*.{js,ts}'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/', 
    '<rootDir>/src/__generated__/',
    '<rootDir>/src/graphql',
    '<rootDir>/src/test-helpers',
    '\\.d\\.ts'
  ],
  transform: {
    '^.+\\.ts(x)?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/']
};

export default config;