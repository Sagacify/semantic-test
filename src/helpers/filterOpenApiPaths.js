module.exports.filterOpenApiPaths = paths => Object.keys(paths || {})
  .reduce((publicPaths, pathKey) => {
    const publicPath = Object.keys(paths[pathKey])
      .reduce((publicPath, verb) => {
        if (!paths[pathKey][verb]['x-saga-no-doc']) {
          publicPath[verb] = paths[pathKey][verb];
        }

        return publicPath;
      }, {});

    if (Object.keys(publicPath).length > 0) {
      publicPaths[pathKey] = publicPath;
    }

    return publicPaths;
  }, {});
