const request = require('supertest');
const { it, expect, describe } = require('@jest/globals');
const app = require('../src/app');

describe('GET /api/v1/banners', () => {
  it('Should return Sukses', async () => {
    const response = await request(app).get('/api/v1/banners');
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Sukses');
  }, 15000);
});
