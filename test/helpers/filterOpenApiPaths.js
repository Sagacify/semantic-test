module.exports.filterOpenApiPaths = {
  tests: [
    {
      name: 'should filter out paths with `x-saga-no-doc` attribute',
      in: [{
        '/healthcheck': {
          get: {
            'x-saga-no-doc': true,
            description: 'Health check of the service'
          }
        },
        '/books': {
          get: {
            description: 'List all the books'
          }
        }
      }],
      out: {
        '/books': {
          get: {
            description: 'List all the books'
          }
        }
      }
    }
  ]
};
