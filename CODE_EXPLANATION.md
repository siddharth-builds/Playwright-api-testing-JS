# Project Core Concepts

## API Testing Scope
This project validates the core CRUD operations of the ReqRes public API using Playwright Test and JavaScript:
- GET: fetch a list of users
- POST: create a new user
- PUT: update an existing user
- DELETE: remove an existing user

The tests are designed to validate HTTP status codes, payload structure, and JSON response content.

## Environment Variables
The project loads `dotenv` in `playwright.config.js` with:

```js
require('dotenv').config();
```

This is useful for local configuration and future secret handling, but the current test suite does not depend on a real API key or secret environment variable. The tests call the public ReqRes endpoints directly and validate their responses without authentication.

## Cross-Browser Execution
The Playwright configuration runs the same API tests across three browser engines:
- Chromium
- Firefox
- WebKit

This ensures the test suite is portable and checks that API behavior remains consistent across common browser contexts.

# Detailed Line-by-Line Breakdown

## 1. Configuration (`playwright.config.js`)

```js
require('dotenv').config();
```

- Loads environment variables from a local `.env` file if present.
- This does not currently affect the API calls in this project because the tests are using the public ReqRes API.

```js
const { defineConfig, devices } = require('@playwright/test');
```

- Imports Playwright’s test configuration utilities and the predefined browser/device presets.

```js
module.exports = defineConfig({
```

- Initializes a Playwright configuration object.

```js
testDir: './specs',
```

- Tells Playwright to look for tests inside the `specs/` directory.

```js
timeout: 30000,
```

- Sets a 30-second timeout for each test.

```js
fullyParallel: true,
```

- Allows Playwright to run tests in parallel when multiple test files are present.

```js
retries: 0,
```

- Disables automatic retries, so failed tests are not retried by default.

```js
reporter: [['html', { open: 'never' }], ['list']],
```

- Generates:
  - an HTML report in the `playwright-report` folder
  - a console list report in the terminal

```js
use: {
  baseURL: 'https://reqres.in',
```

- Sets the base URL for all API requests.
- Requests can be made as relative paths such as `/api/users?page=2`.

```js
extraHTTPHeaders: {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'user-agent': 'Mozilla/5.0 (...) Chrome/122.0.0.0 Safari/537.36'
},
```

- Adds browser-like headers to requests to reduce the chance of bot detection or unexpected blocking from the target API.
- This is useful when testing public APIs that inspect request headers.

```js
trace: 'on-first-retry',
```

- Captures a trace only if a test fails on its first retry.
- Helps debug failed requests and responses.

```js
projects: [
  { name: 'Chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'WebKit', use: { ...devices['Desktop Safari'] } },
],
```

- Configures the project to run the same tests in Chromium, Firefox, and WebKit.
- This is especially useful for validating API stability and compatibility across browser engines.

---

## 2. Test File (`specs/reqres-api.spec.js`)

```js
const { test, expect } = require('@playwright/test');
```

- Imports Playwright’s testing framework and assertion library.

```js
test.describe('ReqRes API Tests', () => {
```

- Groups related API tests under a single suite name.

### GET Request Example

```js
test('GET /api/users?page=2 returns valid user list', async ({ request }) => {
```

- Defines a test that calls the ReqRes users endpoint with page query parameter 2.

```js
const response = await request.get('/api/users?page=2');
```

- Sends an HTTP GET request to fetch the second page of users.

```js
expect(response.status()).toBe(200);
```

- Validates that the API returns HTTP 200 OK.

```js
const body = await response.json();
```

- Parses the response body as JSON.

```js
expect(body.page).toBe(2);
expect(Array.isArray(body.data)).toBeTruthy();
```

- Confirms that:
  - the API returned the requested page number
  - the response contains a valid array of user objects

### POST Request Example

```js
test('POST /api/users creates a new user', async ({ request }) => {
```

- Defines a test for creating a user record.

```js
const payload = { name: 'Siddhu', job: 'Automation Lead' };
```

- Creates a JSON request body with user details.

```js
const response = await request.post('/api/users', {
  headers: { 'Content-Type': 'application/json' },
  data: payload
});
```

- Sends a POST request with JSON payload to the create-user endpoint.

```js
expect(response.status()).toBe(201);
```

- Verifies successful record creation with HTTP 201 Created.

```js
const body = await response.json();
expect(body.name).toBe(payload.name);
expect(body).toHaveProperty('id');
```

- Confirms the server created the user and returned an ID.

### PUT Request Example

```js
test('PUT /api/users/2 updates an existing user', async ({ request }) => {
```

- Defines a test for updating an existing resource.

```js
const payload = { name: 'Siddhu', job: 'Principal Architect' };
```

- Prepares the updated user data.

```js
const response = await request.put('/api/users/2', {
  headers: { 'Content-Type': 'application/json' },
  data: payload
});
```

- Sends a PUT request to user ID 2.

```js
expect(response.status()).toBe(200);
```

- Verifies the request succeeded with HTTP 200 OK.

```js
const body = await response.json();
expect(body.job).toBe(payload.job);
expect(body).toHaveProperty('updatedAt');
```

- Checks that:
  - the job field was updated as expected
  - the response includes an `updatedAt` timestamp

### DELETE Request Example

```js
test('DELETE /api/users/2 removes a user', async ({ request }) => {
```

- Defines a delete request test for an existing user.

```js
const response = await request.delete('/api/users/2');
```

- Sends a DELETE request to user ID 2.

```js
expect(response.status()).toBe(204);
```

- Validates the standard HTTP 204 No Content response, which indicates a successful deletion.

---

## 3. Reusable Fixture (`fixtures/apiFixtures.js`)

This file defines a custom Playwright fixture:

```js
const { test: base } = require('@playwright/test');
```

- Imports the base `test` object.

```js
exports.test = base.extend({
  userApi: async ({ request }, use) => {
```

- Extends Playwright's test fixture system with a `userApi` object.

```js
createUser: async (userData) => {
  const response = await request.post('/api/users', { data: userData });
  return { status: response.status(), body: await response.json() };
},
```

- Adds a helper method to create a user through the API.

```js
deleteUser: async (userId) => {
  const response = await request.delete(`/api/users/${userId}`);
  return { status: response.status() };
}
```

- Adds a helper method to delete a user.

This fixture is useful for organizing repeated API actions and reducing duplication across test files.

---

## 4. Reusable Assertions (`helpers/assertions.js`)

```js
const { expect } = require('@playwright/test');
```

- Imports the assertion library.

```js
function assertValidUserResponse(responseBody, expectedName, expectedJob) {
```

- Defines a reusable assertion function for validating a created/updated user response.

```js
expect(responseBody).toHaveProperty('id');
expect(responseBody).toHaveProperty('createdAt');
expect(responseBody.name).toBe(expectedName);
expect(responseBody.job).toBe(expectedJob);
```

- Verifies that the response contains the expected user object fields and values.

This helper improves reusability and keeps assertions consistent across multiple test cases.

---

## 5. Project Structure

```text
.
├── specs/
│   └── reqres-api.spec.js
├── fixtures/
│   └── apiFixtures.js
├── helpers/
│   └── assertions.js
├── postman/
│   ├── ReqRes_Collection.json
│   └── ReqRes_Env.json
├── playwright.config.js
├── package.json
├── .github/
│   └── workflows/
│       └── test-execution.yml
└── CODE_EXPLANATION.md
```

This structure separates:
- test logic
- reusable fixtures
- assertion helpers
- manual API exploration files
- CI configuration

---

## Summary
This project demonstrates a clean Playwright-based API testing approach for a public REST API. It covers CRUD operations, uses a browser project matrix for broader execution compatibility, organizes reusable components, and includes CI automation for running tests in GitHub Actions.

The test suite is simple, readable, and ideal for learning or extending with additional API scenarios such as validation errors, pagination checks, and authentication flows.
