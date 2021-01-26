const { app } = require('config');
const convert = require('@openapi-contrib/json-schema-to-openapi-schema');
const { name } = require('../package.json');

let documentCache;

module.exports = async () => {
  if (!documentCache) {
    const tmpDocCache = {
      openapi: '3.0.3',
      info: {
        title: name,
        version: 'v1'
      },
      servers: [{
        url: app.url
      }],
      paths: {
        '/healthcheck': {
          get: {
            'x-saga-no-doc': true,
            operationId: 'healthcheck',
            description: 'Health check of the service',
            responses: {
              200: {
                description: 'Healthcheck of the service',
                content: {
                  'application/json': {
                    schema: await convert(require('./schemas/healthcheck'))
                  }
                }
              }
            }
          }
        },
        '/specs': {
          get: {
            'x-saga-no-doc': true,
            operationId: 'specs',
            description: 'Open API specs',
            parameters: [
              {
                in: 'query',
                name: 'documentation',
                schema: { type: 'boolean' }
              }
            ],
            responses: {
              200: {
                description: 'Open API document',
                content: {
                  'application/json': {
                    schema: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    };

    // The if avoids possible race condition
    if (!documentCache) {
      documentCache = tmpDocCache;
    }
  }

  return documentCache;
};
