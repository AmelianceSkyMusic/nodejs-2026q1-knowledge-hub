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

# Run db with container

1. `npm run docker:down` (`docker-compose down -v`) — stop, remove container with its volume
2. `npm run db:generate -- --name init` (`npx drizzle-kit generate --name init`) — generate init migration file (if not init migration exists in /drizzle), or remove /drizzle folder and run this command to start from scratch
3. `npm run docker:db` (`docker-compose up db`) — start db container
4. `npm run db:migrate` (`npx drizzle-kit migrate`) — run migration file
5. `npm run db:seed` (`npx drizzle-kit seed`) — run seed file (optional)
6. `npm run db:studio` (`npx drizzle-kit studio`) — open db studio
