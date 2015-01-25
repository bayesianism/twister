// Karma configuration
// Generated on Sat Jan 24 2015 22:43:15 GMT+0000 (UTC)

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      '../../static/js/twister.js',
      '../../node_modules/angular-mocks/angular-mocks.js',
      '*.js'
    ]
  });
}
