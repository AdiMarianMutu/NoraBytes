/* eslint-disable */
export default {
  displayName: 'ioc',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^(?!.*\\.(ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.tsx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: './coverage',
};
