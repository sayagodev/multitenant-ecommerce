# Payload - Choose a database in this case MongoDB, why?
- Flexible, schemaless structure
- Great for nested + relational data
- Works out of the box with Payload
- Ease & free cloud hosting via Atlas

## Create a mongoDB Cluster in Atlas

## Install Payload

- Payload not support top-level layout.tsx, so create a group (app)
and put all the files there
- bunx create-payload-app@latest --use-bun (pnpm,yarn,etc)
- add the database string, replace the user and password at the end
put the name of the app ".../ecommerce"
- Create a new user in /admin

## tRPC set up

TanStack React Query > Server Components
1. Install the dependencies
2. Follow the guide

## Authentication with Payload

1. Create a procedure with the diferentes methods:
    - login, register, logout, session
2. We can set manually the cookie and use the Local API, but this can cause problems, so
the best way is using the REST API that Payload give us. Automatically set cookie on login.
3. But for this project, we only sustract the setCookie logic and create a function in
utils. But using the ctx.db.config.cookiePrefix of Payload to load the correct cookie.
4. Important! invalidate the session so the user can see the 'dashboard' option.

## Multi Tenancy
1. Crear Tenant Collection 
2. Add the Multi Tenant plugin, is important that the version of the plugin matches the
version of Payload installed.
3. Add the plugin to the payload.config.ts, and attach the collection.
4. We need to update de User collection to add roles, because we need separate
the "super-admin" and "user".
5. In the procedure of user creation, create the tenant.
