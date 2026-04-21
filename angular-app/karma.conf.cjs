module.exports = function (config) {
  const selectedBrowser = process.env.BROWSER || 'Chrome';

  config.set({
    basePath: '',

    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // example:
        // random: false,
        // seed: 4321
      },
      clearContext: false // leave Jasmine output visible in browser
    },

    jasmineHtmlReporter: {
      suppressAll: true // removes duplicated traces
    },

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/ai-assistants'),
      subdir: '.',
      reporters: [
        { type: 'lcov' },
        { type: 'clover' },
        { type: 'json' },
        { type: 'text-summary' }
      ]
    },

    reporters: ['progress', 'kjhtml', 'coverage'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,

    browsers: ['ChromeHeadless', selectedBrowser],

    debugger: {
      ChromeDebugging: {
        base: 'Chrome',
        protocol: 'inspector',
        host: 'localhost',
        port: 9876
      }
    },

    singleRun: true,
    restartOnFileChange: true
  });
};
