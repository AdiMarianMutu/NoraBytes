/* eslint-disable */
export default {
  displayName: 'reactjs-reflexive-store',
  preset: '../../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^(?!.*\\.(ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.tsx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: './coverage',
};