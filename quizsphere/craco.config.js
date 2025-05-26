module.exports = {
  webpack: {
    configure: {
      devtool: false
    }
  },
  jest: {
    configure: {
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    },
  }
};
