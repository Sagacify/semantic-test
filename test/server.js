const { expect } = require('chai');
const request = require('supertest');
const { getApp } = require('../src/server');
const pkg = require('../package.json');

describe('server api', () => {
  let server;

  before(async () => {
    server = await getApp();
  });

  it('should get all books on /healthcheck', () => {
    return request(server)
      .get('/healthcheck')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).to.deep.equal({
          name: pkg.name,
          version: pkg.version
        });
      });
  });
});
