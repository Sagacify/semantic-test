const _ = require('lodash');
const pathUtils = require('path');
const glob = require('glob');
const chai = require('chai');
const expect = chai.expect;

const testCwd = __dirname;
const srcCwd = pathUtils.join(__dirname, '..', 'src');

const paths = glob.sync('**/*.js', {
  cwd: testCwd,
  ignore: ['index.js', 'mocks/**']
});

paths.forEach(path => {
  const description = path.substring(0, path.length - 3).replace(/\//g, ' ');
  const testFile = require(pathUtils.join(testCwd, path));
  const srcFile = require(pathUtils.join(srcCwd, path));
  _.keys(testFile).forEach(key => {
    describe(`${description} ${key}`, async () => {
      if (testFile[key].before) {
        before(testFile[key].before);
      }
      if (testFile[key].beforeEach) {
        beforeEach(testFile[key].beforeEach);
      }
      if (testFile[key].after) {
        after(testFile[key].after);
      }
      if (testFile[key].afterEach) {
        afterEach(testFile[key].afterEach);
      }
      testFile[key].tests.forEach(test => {
        it(test.name || key, async () => {
          if (test.before) {
            await test.before();
          }
          let args = test.in;
          if (!_.isArray(args)) {
            args = [args];
          }
          const func = key === 'default' ? srcFile : srcFile[key];
          let output;
          let error;
          try {
            output = await func(...args);
          } catch (err) {
            error = err;
          }
          try {
            if (_.isFunction(test.out)) {
              await test.out(output, error);
            } else {
              expect(error).to.equal(undefined);
              expect(output).to.deep.equal(test.out);
            }
          } finally {
            if (test.after) {
              await test.after();
            }
          }
        });
      });
    });
  });
});
