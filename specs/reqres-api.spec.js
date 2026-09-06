const { test, expect } = require('@playwright/test');

test.describe('ReqRes API Tests', () => {

  // 1. GET Request
  test('GET /api/users?page=2 returns valid user list', async ({ request }) => {
    const response = await request.get('/api/users?page=2');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.page).toBe(2);
    expect(Array.isArray(body.data)).toBeTruthy();
  });

  // 2. POST Request
  test('POST /api/users creates a new user', async ({ request }) => {
    const payload = { name: 'Siddhu', job: 'Automation Lead' };
    const response = await request.post('/api/users', {
      headers: { 'Content-Type': 'application/json' },
      data: payload
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body).toHaveProperty('id');
  });

  // 3. PUT Request
  test('PUT /api/users/2 updates an existing user', async ({ request }) => {
    const payload = { name: 'Siddhu', job: 'Principal Architect' };
    const response = await request.put('/api/users/2', {
      headers: { 'Content-Type': 'application/json' },
      data: payload
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.job).toBe(payload.job);
    expect(body).toHaveProperty('updatedAt');
  });

  // 4. DELETE Request
  test('DELETE /api/users/2 removes a user', async ({ request }) => {
    const response = await request.delete('/api/users/2');
    expect(response.status()).toBe(204);
  });

});