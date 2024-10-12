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

describe('GET /api/v1/transactions/balance', () => {
  it('Should return Get Balance Berhasil', async () => {
    const response = await request(app)
      .get('/api/v1/transactions/balance')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Get Balance Berhasil');
  }, 15000);
});

describe('POST /api/v1/transactions/topup', () => {
  it('Should return Parameter top_up_amount harus di isi', async () => {
    const response = await request(app)
      .post('/api/v1/transactions/topup')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      'Parameter top_up_amount harus di isi'
    );
  }, 15000);

  it('Should return Parameter top_up_amount harus berupa number', async () => {
    const response = await request(app)
      .post('/api/v1/transactions/topup')
      .send({
        top_up_amount: 'test_amount',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      'Parameter top_up_amount harus berupa number'
    );
  }, 15000);

  it('Should return Jumlah top up harus lebih besar dari 0', async () => {
    const response = await request(app)
      .post('/api/v1/transactions/topup')
      .send({
        top_up_amount: 0,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      'Jumlah top up harus lebih besar dari 0'
    );
  }, 15000);

  it('Should return Top Up Balance berhasil', async () => {
    const response = await request(app)
      .post('/api/v1/transactions/topup')
      .send({
        top_up_amount: 10000,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toEqual('Top Up Balance berhasil');
  }, 15000);
});

describe('POST /api/v1/transactions', () => {
  it('Should return Parameter service_code harus di isi', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      'Parameter service_code harus di isi'
    );
  }, 15000);

  it('Should return Service atau Layanan tidak ditemukan', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        service_code: 'non_existent_service',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual(
      'Service atau Layanan tidak ditemukan'
    );
  }, 15000);

  it('Should return Transaksi berhasil', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        service_code: 'PULSA',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toEqual('Transaksi berhasil');
  }, 15000);
});

describe('GET /api/v1/transactions/history', () => {
  it('Should return Get History Berhasil', async () => {
    const response = await request(app)
      .get('/api/v1/transactions/history?limit=3&offset=0')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Get History Berhasil');
  }, 15000);
});
