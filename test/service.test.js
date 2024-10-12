require('dotenv').config();
const request = require('supertest');
const { it, expect, describe, beforeAll } = require('@jest/globals');
const app = require('../src/app');

let token;

beforeAll(async () => {
  const response = await request(app).post('/api/v1/users/login').send({
    email: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD,
  });
  token = response.body.data.token;
});

describe('GET /api/v1/services', () => {
  it('Should return Sukses', async () => {
    const response = await request(app)
      .get('/api/v1/services')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Sukses');
  }, 15000);
});
