module.exports = {
  type: 'object',
  additionalProperties: false,
  required: ['error'],
  properties: {
    error: { type: 'string' },
    validations: {
      type: 'array',
      items: {
        type: 'object',
        required: ['message'],
        properties: {
          errorCode: { type: 'string' },
          message: { type: 'string' },
          path: { type: 'string' }
        }
      }
    }
  }
};
