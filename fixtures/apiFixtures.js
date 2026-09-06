const { test: base } = require('@playwright/test');

exports.test = base.extend({
  userApi: async ({ request }, use) => {
    const userApiHandler = {
      createUser: async (userData) => {
        const response = await request.post('/api/users', { data: userData });
        return { status: response.status(), body: await response.json() };
      },
      deleteUser: async (userId) => {
        const response = await request.delete(`/api/users/${userId}`);
        return { status: response.status() };
      }
    };
    await use(userApiHandler);
  },
});

exports.expect = base.expect;