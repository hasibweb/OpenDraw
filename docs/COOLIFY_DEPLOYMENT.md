# Deploy OpenDraw with Coolify

This deployment uses public GHCR images, one Docker Compose application, and a
separate Coolify-managed PostgreSQL resource. Only the web service is public.
Next.js forwards `/api/*` to Hono over the private Compose network.

## 1. Create PostgreSQL

1. In the production Coolify project and environment, create a PostgreSQL 17
   resource and start it.
2. Do not enable public database access.
3. Copy its internal connection URL. Store it as `DATABASE_URL` on the OpenDraw
   Compose application.
4. Enable scheduled backups to S3-compatible storage. Run one backup every day
   and retain 14 days.
5. Perform a restore into a temporary database before launch, then remove that
   temporary database after verification.

The first application deployment runs all committed Drizzle migrations and then
seeds the `guest`, `free`, and `pro` plan rows. It does not import local users,
sessions, projects, or diagrams.

## 2. Create the Compose application

1. Create a Docker Compose application from
   `https://github.com/hasibweb/OpenDraw`, branch `main`, using
   `/docker-compose.yml`.
2. Turn off Coolify's Git-triggered automatic deployment. GitHub Actions queues
   the deployment only after checks and both images have been published.
3. Enable **Connect to Predefined Network** for both the Compose application and
   PostgreSQL resource. Keep both resources in the same Coolify project and
   environment.
4. Assign `https://draw.hasibweb.com` to the `web` service on port 3001. Do not
   assign a public domain or port to `server` or `db-setup`.
5. Point the DNS record for `draw.hasibweb.com` to the Coolify server and confirm
   Coolify issues a valid TLS certificate.

Set these Compose environment variables in Coolify:

```dotenv
DATABASE_URL=<private Coolify PostgreSQL URL>
BETTER_AUTH_SECRET=<random value with at least 32 characters>
GITHUB_CLIENT_ID=<production GitHub OAuth client ID>
GITHUB_CLIENT_SECRET=<production GitHub OAuth client secret>
GOOGLE_GENERATIVE_AI_API_KEY=<platform Gemini API key>
BYOK_ENCRYPTION_KEY=<base64 encoded 32-byte key>
RESEND_API_KEY=<production Resend API key>
RESEND_FROM="OpenDraw <support@hasibweb.com>"
OPENDRAW_IMAGE_TAG=main
```

Generate `BETTER_AUTH_SECRET` and `BYOK_ENCRYPTION_KEY` independently. Do not
reuse one key for both purposes. Leave `COOKIE_DOMAIN` and every `DODO_*`
variable unset. Billing is disabled when the complete Dodo configuration is
absent.

Optional observability settings:

```dotenv
SENTRY_TRACES_SAMPLE_RATE=1
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=1
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
```

The Compose file owns the fixed production values for `BETTER_AUTH_URL`,
`CORS_ORIGIN`, `NEXT_PUBLIC_SERVER_URL`, and `API_UPSTREAM_URL`.

## 3. Configure external services

Create a production GitHub OAuth App with:

```text
Homepage URL: https://draw.hasibweb.com
Authorization callback URL: https://draw.hasibweb.com/api/auth/callback/github
```

Verify `hasibweb.com` in Resend before using `support@hasibweb.com`. Repository
import requests only the `read:user` and `user:email` OAuth scopes and shows only
public repositories.

Billing is intentionally disabled for the first release. Do not create a Dodo
webhook until all four production `DODO_*` values are ready to be enabled
together.

## 4. Configure GitHub Actions

Enable Coolify API access, create a deploy-only token, and copy the Compose
application's deployment webhook. Add these Actions secrets to the GitHub
repository:

```text
COOLIFY_TOKEN
COOLIFY_WEBHOOK
SENTRY_AUTH_TOKEN  # optional, used only while building the web image
```

The workflow uses `GITHUB_TOKEN` to publish both images. After their first
publication, set these package versions to **Public** in GitHub Packages:

```text
ghcr.io/hasibweb/opendraw-web
ghcr.io/hasibweb/opendraw-server
```

The first queued Coolify deployment can fail until that one-time visibility
change is complete. Redeploy it after both packages are public. Later pushes to
`main` publish `main` and immutable commit-SHA tags, trigger Coolify, and wait up
to ten minutes for both health endpoints to report the expected SHA.

## 5. Verify and roll back

After deployment, verify:

```text
https://draw.hasibweb.com/health
https://draw.hasibweb.com/api/health
```

Then exercise registration, verification, password reset, GitHub sign-in,
account linking, public repository import, guest generation, signed-in
generation, BYOK generation, quota display, and sign-out. Inspect `/analyze-logs`
after the authentication, import, and generation flows.

To roll back, set `OPENDRAW_IMAGE_TAG` in Coolify to a previously successful
40-character commit SHA and redeploy. Both web and server images use the same
tag. After recovery, return the value to `main` before the next normal release.

Coolify reference documentation:

- <https://coolify.io/docs/applications/ci-cd/github/actions/>
- <https://next.coolify.io/docs/core/automation/deploy-webhooks>
- <https://coolify.io/docs/applications/build-packs/docker-compose>
- <https://next.coolify.io/docs/databases/backups>
