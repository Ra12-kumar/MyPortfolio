import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('admin API protection', () => {
  it.each([
    ['get', '/api/v1/admin/inquiries'],
    ['get', '/api/v1/admin/inquiries/analytics'],
    ['patch', '/api/v1/admin/inquiries/2b0f8a52-4a8c-4a52-9d7a-3f1d3b8b8f10'],
    ['get', '/api/v1/admin/projects'],
    ['post', '/api/v1/admin/projects'],
    ['delete', '/api/v1/admin/faqs/2b0f8a52-4a8c-4a52-9d7a-3f1d3b8b8f10'],
    ['post', '/api/v1/admin/uploads'],
  ])('%s %s requires a bearer token', async (method, path) => {
    const res = await request(app)[method](path);
    expect(res.status).toBe(401);
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('rejects non-bearer authorization schemes', async () => {
    const res = await request(app).get('/api/v1/admin/inquiries').set('Authorization', 'Basic abc');
    expect(res.status).toBe(401);
  });

  it('login validates input', async () => {
    const res = await request(app).post('/api/v1/admin/login').send({ email: 'bad' });
    expect(res.status).toBe(400);
  });

  it('login reports missing Supabase configuration instead of crashing', async () => {
    const res = await request(app).post('/api/v1/admin/login').send({ email: 'admin@example.com', password: 'secret123' });
    expect(res.status).toBe(503);
  });
});
