Project Core Concepts

API Testing Scope: Tests cover all 4 fundamental HTTP CRUD methods (GET, POST, PUT, DELETE) against the ReqRes REST API endpoints.

Environment Variables: Sensitive data like API keys are kept in .env locally and referenced securely via process.env.REQRES_API_KEY to prevent accidental exposure on GitHub.

Cross-Browser Execution: Playwright executes every API test across 3 browser contexts (Chromium, Firefox, WebKit) concurrently in headless mode.

Detailed Line-by-Line Breakdown

1. Configuration (playwright.config.js)

require('dotenv').config();: Loads local secret keys from your .env file into Node's runtime environment.

baseURL: '[https://reqres.in](https://reqres.in)': Defines the root domain so endpoints can be called relative to the server (e.g., /api/users).

extraHTTPHeaders: Sets Global HTTP headers (Content-Type, Accept, and standard browser User-Agent) on every request to avoid bot blocking and 403 Forbidden errors.

projects: Configures Playwright to mirror executions in parallel across Chromium, Firefox, and WebKit engines.

2. Test File (specs/reqres-api.spec.js)

GET Request (Fetch Data)

request.get('/api/users?page=2'): Sends an HTTP GET request to pull page 2 of user records.

expect(response.status()).toBe(200): Asserts the server returns a successful 200 OK HTTP status code.

expect(body.page).toBe(2) & expect(Array.isArray(body.data)).toBeTruthy(): Verifies response schema structure and validates that user data returns inside a valid JavaScript array.

POST Request (Create Resource)

payload: Defines the dynamic user details (name, job) as a JSON payload.

request.post('/api/users', { data: payload }): Sends an HTTP POST call with JSON data to create a record.

expect(response.status()).toBe(201): Confirms the resource creation status 201 Created.

expect(body).toHaveProperty('id'): Verifies that the mock backend automatically assigned a unique id to the newly created record.

PUT Request (Update Resource)

request.put('/api/users/2', { data: payload }): Sends an HTTP PUT call targeting user ID 2 to modify job details.

expect(response.status()).toBe(200): Validates that the update succeeded with code 200 OK.

expect(body).toHaveProperty('updatedAt'): Confirms the server attached an updated timestamp property.

DELETE Request (Remove Resource)

request.delete('/api/users/2'): Sends an HTTP DELETE call to clear user ID 2.

expect(response.status()).toBe(204): Verifies the standard HTTP 204 No Content status code indicating successful deletion with no body content returned.