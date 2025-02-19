# Email and password example with 2FA in SvelteKit

Built with MySQL (as opposed to the sqlite version at https://github.com/lucia-auth/example-sveltekit-email-password-2fa).

Migrated to Sevlte 5.

- Password check with HaveIBeenPwned
- Email verification
- 2FA with TOTP
- 2FA recovery codes
- Password reset
- Login throttling and rate limiting

Emails are just logged to the console. Rate limiting is implemented using JavaScript `Map`.

## Initialize project

Create a .env file. Generate a 128 bit (16 byte) string, base64 encode it, and set it as `ENCRYPTION_KEY`.

```bash
ENCRYPTION_KEY="L9pmqRJnO1ZJSQ2svbHuBA=="
```

> You can use OpenSSL to quickly generate a secure key.
>
> ```bash
> openssl rand --base64 16
> ```

Also add url for the MySQL database

```bash
USER_DATABASE_URL="mysql://USERNAME:PASSWORD@sHOST:PORT/DATABASE"
```

Install dependencies, push the database using Drizzle and run the application:

```
pnpm i
pnpm run db:push
pnpm dev
```

## Notes (from Lucia team)

- We do not consider user enumeration to be a real vulnerability so please don't open issues on it. If you really need to prevent it, just don't use emails.
- This example does not handle unexpected errors gracefully.
- There are some major code duplications (specifically for 2FA) to keep the codebase simple.
- TODO: You may need to rewrite some queries and use transactions to avoid race conditions when using MySQL, Postgres, etc.
- TODO: This project relies on the `X-Forwarded-For` header for getting the client's IP address.
- TODO: Logging should be implemented.
