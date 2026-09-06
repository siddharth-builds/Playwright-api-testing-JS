const { expect } = require('@playwright/test');

function assertValidUserResponse(responseBody, expectedName, expectedJob) {
  expect(responseBody).toHaveProperty('id');
  expect(responseBody).toHaveProperty('createdAt');
  expect(responseBody.name).toBe(expectedName);
  expect(responseBody.job).toBe(expectedJob);
}

module.exports = { assertValidUserResponse };