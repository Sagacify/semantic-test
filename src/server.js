const config = require('config');
const pathUtil = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ManagedError = require('saga-managed-error');
const { Autoroute } = require('@sagacify/autoroute');
const log = require('saga-logger').create({ module: module.id });
const getDocument = require('./openapi');
const OpenApiValidator = require('express-openapi-validator');
const { BadRequest } = require('express-openapi-validator/dist/framework/types');

const getApp = async () => {
  const app = express();
  const apiDocument = await getDocument();

  // For security reason, remove 'X-Powered-By: Express' from the headers
  app.disable('x-powered-by');
  // Parse application/json
  app.use(bodyParser.json({
    limit: config.app.maxFileSize
  }));

  app.use('/api-docs', express.static(pathUtil.join(__dirname, '/docs')));

  app.use(
    OpenApiValidator.middleware({
      apiSpec: apiDocument,
      validateResponses: true // <-- to validate responses
      // unknownFormats: ['my-format'] // <-- to provide custom formats
    })
  );

  const autoroute = new Autoroute(
    express.Router, {
      read: 'get',
      create: 'post',
      update: 'put',
      destroy: 'delete'
    }
  );

  const router = autoroute.createRouter(
    pathUtil.join(__dirname, 'controllers')
  );
  app.use('/', router);

  app.all('*', (req, res, next) => {
    next(new ManagedError('SERVER_ERROR', 404));
  });

  // Error Handler (the 4 arguments are required!)
  app.use((error, req, res, next) => { // NOSONAR
    // express-openapi-validator uses error.status
    const statusCode = error.statusCode || error.status || 500;
    const data = { error: error.message };

    if (error instanceof BadRequest && error.errors) {
      data.validations = error.errors;
    }

    if (
      error instanceof ManagedError &&
      error.statusCode === 400 &&
      error.validations
    ) {
      data.validations = error.validations;
    }

    const { method, path, query, body } = req;

    if (statusCode < 500) {
      log.warn('SERVER_WARNING', error, { method, path, query, body });
    } else {
      log.error('SERVER_FAIL', error, { method, path, query, body });
    }

    res.status(statusCode).json(data);
  });

  return app;
};

const start = async (port) => {
  const app = await getApp();

  return new Promise(resolve => app.listen(port, resolve));
};

module.exports = {
  getApp,
  start
};
