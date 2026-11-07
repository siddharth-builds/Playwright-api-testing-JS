# Playwright API Testing (JavaScript)

A REST API test suite built with [Playwright Test](https://playwright.dev/) and JavaScript. It exercises CRUD endpoints on the [ReqRes](https://reqres.in/) API and checks HTTP status codes and response data.

## What’s covered

The tests in `specs/reqres-api.spec.js` cover:

| Method | Endpoint | Checks |
| --- | --- | --- |
| GET | `/api/users?page=2` | Successful response, requested page, and user-list structure |
| POST | `/api/users` | Resource creation, submitted fields, and returned ID |
| PUT | `/api/users/2` | Successful update, updated fields, and timestamp |
| DELETE | `/api/users/2` | Successful deletion (`204 No Content`) |

Playwright is configured to run the suite as Chromium, Firefox, and WebKit projects. Since these are API tests, they use Playwright’s `request` fixture rather than browser page interactions.

## Prerequisites

- Node.js 20 or later
- npm
- Network access to ReqRes

## Setup and run

```bash
git clone https://github.com/siddharth-builds/Playwright-api-testing-JS.git
cd Playwright-api-testing-JS
npm ci
npm test
```

To run tests with a headed browser context where applicable:

```bash
npm run test:headed
```

The npm scripts run Playwright Test using the repository’s configuration. Each configured Playwright project executes the tests.

## Reports

The configured reporters print a list in the terminal and create an HTML report. After a run, open the report with:

```bash
npx playwright show-report
```

## Project structure

```text
.
├── fixtures/
│   └── apiFixtures.js       # Reusable API fixture
├── helpers/
│   └── assertions.js        # Shared response assertions
├── specs/
│   └── reqres-api.spec.js   # CRUD API tests
├── postman/
│   ├── ReqRes_Collection.json
│   └── ReqRes_Env.json
├── playwright.config.js     # Test settings and browser projects
├── package.json
└── .github/workflows/
    └── test-execution.yml   # GitHub Actions workflow
```

`CODE_EXPLANATION.md` provides additional notes on the project’s configuration and test cases.

## Configuration

The Playwright configuration sets `https://reqres.in` as the base URL, uses `specs/` as the test directory, and enables HTML and list reporters. The test suite is configured for parallel execution across Chromium, Firefox, and WebKit.

The repository also includes a Postman collection and environment under `postman/` for manually exploring the same CRUD endpoints. Keep any real API credentials private; do not commit secrets to the repository.

## Continuous integration

The GitHub Actions workflow runs on pushes and pull requests targeting `main`. It installs Node.js 20, installs dependencies with `npm ci`, installs Chromium, runs `npx playwright test`, and uploads the Playwright HTML report as an artifact.
