import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    'main.ts',
    'app.module.ts',
    'app.controller.ts',
    'app.service.ts',
    'src/migrations/',
    '.*\\.module\\.ts$',
    '.*\\.types\\.ts$',
    'typeorm.config.ts',
  ],
};

export default config;
