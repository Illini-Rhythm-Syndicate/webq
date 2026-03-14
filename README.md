# IRS UIUC WebQ

Web-based queue management system for Illini Rhythm Syndicate freeplays.

## Setup

```
git clone https://github.com/Illini-Rhythm-Syndicate/webq.git
cd webq
npm i
```

Create `.env` then copy-paste contents of `.env.example` and populate. Discord Client ID and secret can be obtained from the [Discord Developer Portal](https://discord.com/developers/applications).

`npm run css` to generate CSS styling with Tailwind CLI. Keep terminal running for hot updates.

`npm run dev` to start app, server runs on `http://localhost:3000` by default.

Update `src/admins.js` with Discord IDs to grant admin permissions on the app.
