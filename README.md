# Knowledge Hub

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/get-started).

## Docker

### Docker Hub Image

- [Link to Docker Hub Image →](https://hub.docker.com/r/amelianceskymusic/knowledge-hub-app)

### Running application with Docker

1. Create `.env` file from `.env.example`.
2. Start services:
   ```bash
   docker-compose up --build
   ```
3. Database management tools (optional):

   - **Adminer** (lightweight for crosschecking): [http://localhost:8080](http://localhost:8080)

      ```bash
      docker-compose --profile debug up --build
      ```

   - **pgAdmin** (feature-rich for development): [http://localhost:8888](http://localhost:8888)
      ```bash
      docker-compose --profile pgadmin up --build
      ```

4. Stop and cleanup:

   - **Basic cleanup** (stops API and Database):

      ```bash
      docker-compose down -v
      ```

   - **Full cleanup** (stops everything including management tools):
      ```bash
      docker-compose --profile "*" down -v
      ```

After startup, you can access:

- **API**: [http://localhost:4000](http://localhost:4000)
- **Health Check**: [http://localhost:4000/health](http://localhost:4000/health)
- **Documentation**: [http://localhost:4000/doc](http://localhost:4000/doc)

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

To run refresh token tests

```
npm run test:refresh
```

To run RBAC (role-based access control) tests

```
npm run test:rbac
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

## Run db with container

1. `npm run docker:down` (`docker compose down -v`) — stop, remove container with its volume
2. `npm run db:generate -- --name init` (`npx drizzle-kit generate --name init`) — generate init migration file (if not init migration exists in /drizzle), or remove /drizzle folder and run this command to start from scratch
3. `npm run docker:db` (`docker compose up db`) — start db container
4. `npm run db:migrate` (`npx drizzle-kit migrate`) — run migration file
5. `npm run db:seed` (`npx drizzle-kit seed`) — run seed file (optional)
6. `npm run db:studio` (`npx drizzle-kit studio`) — open db studio

## Requirements

### How to obtain a Gemini API key

1. **Create an account**: Sign in to your [Google Account](https://accounts.google.com)
2. **Access AI Studio**: Visit [Google AI Studio](https://aistudio.google.com) and click **Get started**
3. **Navigate to API Keys**: Click **Get API key** in the bottom-left sidebar or go directly to the [API Keys page](https://aistudio.google.com/app/apikey)
4. **Generate Key**: Click **Create API key**, name key and select (or create) a project, and confirm
5. **Configure**: Copy the key and paste it into your `.env` file under the `GEMINI_API_KEY` variable

### Model Selection

In assignment is assumed that you will use stable model

Since `gemini-2.0-flash` has no free-tier limits, you can use next generation `gemini-2.5-flash` as a production ready model with best price-performance ratio, but for checking you can try other models:

- **`gemini-2.5-flash`**: Production-ready and stable

   _Limits: 5 RPM, 250K TPM, 20 RPD_

- **`gemini-3.1-flash-lite`**: Model with most generous free-tier limits, but not simple as gemma

   _Limits: 15 RPM, 250K TPM, 500 RPD_

- **`gemini-3.1-flash-lite-preview`**: Preview version of the lite model with same limits

   _Limits: 15 RPM, 250K TPM, 500 RPD_

- **`gemini-3-flash-preview`**: Next-gen model currently in preview (not yet production-ready)

   _Limits: 5 RPM, 250K TPM, 20 RPD_

### Setup Guide

Follow these steps to get the project running locally:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/AmelianceSkyMusic/nodejs-2026q1-knowledge-hub.git .
   ```

2. **Switch to Target Branch**:
   For the AI Integration assignment, use:

   ```bash
   git checkout kh-07-ai-llm-integration
   ```

3. **Install Dependencies & environment**:

   ```bash
   npm install
   ```

4. **Create and prepare `.env` file:**

   ```bash
   cp .env.example .env
   ```

5. **Configure API Key**:
   Open the `.env` file and replace `your-gemini-api-key` with your actual key

6. **Configure Model**:
   Open the `.env` file and replace `gemini-2.0-flash` with your actual model

7. **Initialize Services**:
   You can start everything (database reset, migrations, and studio) with one command:

   ```bash
   npm run db:clean-start
   ```

   _If the above command fails, run these steps manually:_

   ```bash
   docker compose down -v
   docker compose up db -d
   # Wait for DB to start
   npx drizzle-kit migrate
   npx drizzle-kit studio
   ```

8. **Troubleshooting Docker**:
   If Docker fails to start, try a full reset:

   ```bash
   docker stop postgres && docker rm postgres
   docker compose down -v
   ```

   Ensure **Docker Desktop** is running

9. **Launch the Application**:
   ```bash
   npm run dev
   ```

### Test AI endpoints

**Custom client:**

- Open `client/ai.html` in your browser

**Scalar:**

- http://localhost:4000/doc

**Swagger:**

- http://localhost:4000/doc/swagger

**Generate json / yaml file and import in your favorite API client:**

- http://localhost:4000/doc/json
- http://localhost:4000/doc/yaml

### Known limitations

#### Model limitation

| Model                         | RPM | TPM  | RPD |
| ----------------------------- | --- | ---- | --- |
| gemini-3-flash-preview        | 5   | 250K | 20  |
| gemini-2.5-flash              | 5   | 250K | 20  |
| gemini-3.1-flash-lite         | 15  | 250K | 500 |
| gemini-3.1-flash-lite-preview | 15  | 250K | 500 |

(Limits current as of 2026-05-01)

Full details available at: [Google AI Studio Rate Limits](https://aistudio.google.com/rate-limit)

⚠️ **Note**: Latency and regional availability may vary. Please verify service status in your current region
