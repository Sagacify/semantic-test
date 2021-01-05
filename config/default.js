const { env } = process;

module.exports = {
  app: {
    port: env.APP_PORT,
    maxFileSize: env.MAX_FILE_SIZE,
    url: env.APP_URL
  }
};
