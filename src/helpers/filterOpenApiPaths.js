module.exports.filterOpenApiPaths = paths => Object.keys(paths || {})
  .reduce((publicPathsAcc, pathKey) => {
    const publicPath = Object.keys(paths[pathKey])
      .reduce((publicPathAcc, verb) => {
        if (!paths[pathKey][verb]['x-saga-no-doc']) {
          publicPathAcc[verb] = paths[pathKey][verb];
        }

        return publicPathAcc;
      }, {});

    if (Object.keys(publicPathsAcc).length > 0) {
      publicPathsAcc[pathKey] = publicPath;
    }

    return publicPathsAcc;
  }, {});
