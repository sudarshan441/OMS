const request = require('supertest');
const app = require('../index'); // if refactored for testability

describe('Health Route', () => {
  it('should return OK status', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});
