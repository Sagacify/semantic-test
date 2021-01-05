// Fix 1
// Fix 2
const config = require('config');
const server = require('./server');
const log = require('saga-logger').create({ module: module.id });

process.on('uncaughtException', err => {
  log.fatal('UNCAUGHT_EXCEPTION', err);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  log.fatal('UNHANDLED_REJECTION', err);
  process.exit(1);
});

const main = async () => {
  await server.start(config.app.port);
  log.info('SERVER_START_SUCCESS');
};

main();
