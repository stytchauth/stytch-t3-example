# Stytch T3 example application

<p align="center">
  <img width="1066" alt="t3Example" src="https://github.com/chris-stytch/stytch-t3-example/assets/91094210/d6554592-d6f4-4012-a3b4-82a60e5a1e58" width="750">
</p>

## Overview

This example application demonstrates how one may use Stytch within the [T3 stack](https://create.t3.gg/).

This project uses Stytch's [Node SDK](https://stytch.com/docs/api) which provides a fully typesafe and backend driven authentication pattern. This allows you to own the frontend and authentication to live alongside your business logic in the backend.

This application features One-Time Passcodes (OTP) sent via either email or SMS. You can use this application's source code as a learning resource, or use it as a jumping off point for your own project. We are excited to see what you build with Stytch!

## Set up

Follow the steps below to get this application fully functional and running using your own Stytch credentials.

### In the Stytch Dashboard

1. Create a [Stytch](https://stytch.com/) account. Once your account is set up a Project called "My first project" will be automatically created for you. If you already have a Stytch account, create a new Project.

2. Now navigate to [API Keys](https://stytch.com/dashboard/api-keys). You will need the `project_id` and `secret` values found on this page later on.

### On your machine

In your terminal clone the project and install dependencies:

```bash
# If necessary, install pnpm
brew install pnpm

git clone https://github.com/chris-stytch/stytch-t3-example.git
cd test-stytch-t3-example
pnpm i
```

Next, create `.env` file by running the command below which copies the contents of `.env.template`.
```bash
cp .env.template .env
```

Open `.env` in the text editor of your choice, and set the environment variables using the `project_id` and `secret` found on [API Keys](https://stytch.com/dashboard/api-keys). Leave the `STYTCH_PROJECT_ENV` value as `test`.

```
# This is what a completed .env file will look like
STYTCH_PROJECT_ENV=test
STYTCH_PROJECT_ID=project-test-00000000-0000-1234-abcd-abcdef1234
STYTCH_SECRET=secret-test-12345678901234567890abcdabcd
DATABASE_URL="file:./dev.db"
```

## Running locally

After completing all the set up steps above the application can be run with the command:

```bash
# Initialize the database
pnpm prisma:init

# Run the app
pnpm dev
```

The application will be available at [`http://localhost:3000`](http://localhost:3000).

You'll be able to login with Email OTP or SMS OTP and see your Stytch User object, Stytch Session, and see how logging out works.

## Next steps

This example app showcases a small portion of what you can accomplish with Stytch. Here are a few ideas to explore:

1. Add additional login methods like [Passwords](https://stytch.com/docs/passwords#guides_getting-started-sdk).
2. Secure your app further by building MFA authentication using methods like [WebAuthn](https://stytch.com/docs/sdks/javascript-sdk#webauthn).

## Get help and join the community

#### :speech_balloon: Stytch community Slack

Join the discussion, ask questions, and suggest new features in our ​[Slack community](https://join.slack.com/t/stytch/shared_invite/zt-nil4wo92-jApJ9Cl32cJbEd9esKkvyg)!

#### :question: Need support?

Check out the [Stytch Forum](https://forum.stytch.com/) or email us at [support@stytch.com](mailto:support@stytch.com).
