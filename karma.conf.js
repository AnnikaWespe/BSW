// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma'),

      require('karma-mocha-reporter'),
      require('karma-jasmine-diff-reporter')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test-setup.ts', watched: false }
    ],
    preprocessors: {
      './src/test-setup.ts': ['@angular/cli']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['mocha', 'jasmine-diff', 'coverage-istanbul']
              : ['mocha', 'jasmine-diff'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,

    mochaReporter: {
      ignoreSkipped: true
    },

    jasmineDiffReporter: {
      pretty: false,
      multiline: true,
      verbose: true,
      matchers: {}
    }
  });
};
