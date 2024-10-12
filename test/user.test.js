require('dotenv').config();
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { it, expect, describe } = require('@jest/globals');
const app = require('../src/app');
const jwt = require('jsonwebtoken');

let token;

const image = fs.readFileSync(path.join(__dirname, '../public/black.jpg'));
const invalidImage = fs.readFileSync(
  path.join(__dirname, '../public/jisoo.webp')
);

describe('POST /api/v1/users/register', () => {
  it('Should return Parameter first_name harus di isi', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      last_name: 'test',
      email: 'test@example.com',
      password: 'password',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Parameter first_name harus di isi');
  }, 15000);

  it('Should return Parameter last_name harus di isi', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      first_name: 'test',
      email: 'test@example.com',
      password: 'password',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Parameter last_name harus di isi');
  }, 15000);

  it('Should return Parameter email harus di isi', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      first_name: 'test',
      last_name: 'test',
      password: 'password',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Parameter email harus di isi');
  }, 15000);

  it('Should return Parameter email tidak sesuai format', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      first_name: 'test',
      last_name: 'test',
      email: 'test',
      password: 'password',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      'Parameter email tidak sesuai format'
    );
  }, 15000);

  it('Should return Parameter password harus di isi', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      first_name: 'test',
      last_name: 'test',
      email: 'test@example.com',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Parameter password harus di isi');
  }, 15000);

  it('Should return Password length minimal 8 karakter', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      first_name: 'test',
      last_name: 'test',
      email: 'test@example.com',
      password: 'pass',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Password length minimal 8 karakter');
  }, 15000);

  it('Should return Email ini sudah di gunakan', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      first_name: 'test',
      last_name: 'test',
      email: process.env.USER_EMAIL,
      password: 'password123',
    });
    expect(response.status).toBe(409);
    expect(response.body.message).toEqual('Email ini sudah di gunakan');
  }, 15000);

  it('Should return Registrasi berhasil silahkan login', async () => {
    const response = await request(app)
      .post('/api/v1/users/register')
      .send({
        first_name: 'test',
        last_name: 'test',
        email: `${Date.now()}@gmail.com`,
        password: 'password123',
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toEqual('Registrasi berhasil silahkan login');
  }, 15000);
});

describe('POST /api/v1/users/login', () => {
  it('Should return Parameter email harus di isi', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      password: 'password',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Parameter email harus di isi');
  }, 15000);

  it('Should return Parameter email tidak sesuai format', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test',
      password: 'password',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      'Parameter email tidak sesuai format'
    );
  }, 15000);

  it('Should return Parameter password harus di isi', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@example.com',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Parameter password harus di isi');
  }, 15000);

  it('Should return Password length minimal 8 karakter', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@example.com',
      password: 'pass',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Password length minimal 8 karakter');
  }, 15000);

  it('Should return Email tidak ada', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('Email tidak ada');
  }, 15000);

  it('Should return Password salah', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: process.env.USER_EMAIL,
      password: 'password123456',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Password salah');
  }, 15000);

  it('Should return Login Sukses', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
    });
    token = response.body.data.token;
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Login Sukses');
  }, 15000);
});

describe('GET /api/v1/users/profile', () => {
  it('Should return Unauthorized', async () => {
    const response = await request(app).get('/api/v1/users/profile');
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  }, 15000);

  it('Should return Token has expired', async () => {
    const expiredToken = jwt.sign(
      { email: 'testo@gmail.com' },
      process.env.JWT_SECRET,
      {
        expiresIn: '0s',
      }
    );
    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Token has expired');
  }, 15000);

  it('Should return Invalid token', async () => {
    const expiredToken = jwt.sign(
      { email: 'testo@gmail.com' },
      process.env.JWT_SECRET,
      {
        expiresIn: '0s',
      }
    );
    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${expiredToken}s`);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Invalid token');
  }, 15000);

  it('Should return User not found', async () => {
    const invalidToken = jwt.sign(
      { email: 'testo@gmail.com' },
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
      }
    );
    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${invalidToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('User not found');
  }, 15000);

  it('Should return Sukses', async () => {
    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Sukses');
  }, 15000);
});

describe('PUT /api/v1/users/update', () => {
  it('Should return Parameter first_name harus di isi', async () => {
    const response = await request(app)
      .put('/api/v1/users/profile/update')
      .send({
        last_name: 'test',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Parameter first_name harus di isi');
  }, 15000);

  it('Should return Parameter last_name harus di isi', async () => {
    const response = await request(app)
      .put('/api/v1/users/profile/update')
      .send({
        first_name: 'test',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Parameter last_name harus di isi');
  }, 15000);

  it('Should return Update Pofile berhasil', async () => {
    const response = await request(app)
      .put('/api/v1/users/profile/update')
      .send({
        first_name: 'test',
        last_name: 'test',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Update Pofile berhasil');
  }, 15000);
});

describe('PUT /api/v1/users/image', () => {
  it('Should return Parameter image harus di isi', async () => {
    const response = await request(app)
      .put('/api/v1/users/profile/image')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Parameter image harus di isi');
  }, 15000);

  it('Should return Format Image tidak sesuai', async () => {
    const response = await request(app)
      .put('/api/v1/users/profile/image')
      .attach('image', invalidImage, 'jisoo.webp')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Format Image tidak sesuai');
  }, 15000);

  it('Should return Update Profile Image berhasil', async () => {
    const response = await request(app)
      .put('/api/v1/users/profile/image')
      .attach('image', image, 'black.jpg')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('Update Profile Image berhasil');
  }, 15000);
});
