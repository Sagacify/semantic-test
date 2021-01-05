const getDocument = require('../openapi');
const { filterOpenApiPaths } = require('../helpers/filterOpenApiPaths');

module.exports.read = async ({ documentation }) => {
  const apiDocument = await getDocument();
  const finalApiDocument = documentation
    ? {
        ...apiDocument,
        paths: filterOpenApiPaths(apiDocument.paths)
      }
    : apiDocument;

  return finalApiDocument;
};
