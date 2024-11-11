# Turbo Repo NextJS

This is a sample application using NextJS, Drizzle, Postgres, tRPC, & Email Auth.

## Requirements

- NodeJS `v20.14.0` or greater
- Docker
- pnpm `v8.15.4` or greater (Required for workspaces)

## Quickstart

```bash
# FROM: ./

pnpm install;

# copy local environment variables
cp .env.example .env;

# start docker postgres and mailhog
pnpm db:up; 
pnpm db:push;

# start services
pnpm dev;
```

## Mailhog

For local email authentication testing visit [http://localhost:8025](http://localhost:8025).