import request from 'supertest';
import { app, startServer, closeServer } from '../../src/Server';
import School from '../../src/models/School.model';
import User from '../../src/models/User.model';

describe('Auth API', () => {
  beforeAll(async () => {
    const url = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/gyan-setu-test';
    await startServer(url, 0); // Use a random available port
  });

  afterAll(async () => {
    await closeServer();
  });

  beforeEach(async () => {
    // Create a school for testing
    await School.create({ name: 'Test School', schoolCode: 'TEST123' });
  });

  afterEach(async () => {
    // Clean up collections
    await User.deleteMany({});
    await School.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    const registrationData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123',
      schoolCode: 'TEST123',
    };

    it('should register a new user and return 201', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(registrationData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(registrationData.email);
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should return 400 for an invalid school code', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...registrationData, schoolCode: 'INVALID' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid school code');
    });

    it('should return 409 if the user already exists', async () => {
      // First, register the user
      await request(app)
        .post('/api/v1/auth/register')
        .send(registrationData);

      // Then, try to register again with the same email
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(registrationData);

      expect(res.statusCode).toEqual(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User with this email already exists');
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...registrationData, email: 'not-an-email' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toBeInstanceOf(Array);
      expect(res.body.errors[0].field).toBe('email');
    });
  });
});

