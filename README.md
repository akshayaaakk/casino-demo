# Backroom — Demo Tables

A **virtual-currency-only** demo of three casino-style games — Dragon & Tiger, Aviator, and Head or Tail — with account login and a shared real-time multiplayer round for Aviator.

**This is a demo/portfolio project, not a gambling product.** There is no payment processing anywhere in this code. Every player starts with 1,000 free "demo chips" that have no real-world value and cannot be cashed out. If you ever want to turn this into a real-money product, you'd need a gambling license and a licensed payment processor first — that's a legal/business step, not a coding one.

## What's inside

- `server/` — Node.js + Express + Socket.IO + SQLite backend
  - Username/password auth (bcrypt-hashed passwords, JWT sessions)
  - REST endpoints for Dragon & Tiger and Coin Toss (server-side RNG, so results can't be faked from the browser)
  - A live Socket.IO "room" for Aviator, so every connected player sees the same multiplier climb in real time and can cash out independently — this is what makes it feel like an online multiplayer table instead of a single-player toy
- `client/` — React (Vite) frontend with a dark card-room visual theme

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes npm) — download and run the installer for your OS
- [VS Code](https://code.visualstudio.com/) with the built-in terminal (or any terminal you like)

## Step-by-step setup

### 1. Open the project in VS Code

Unzip the project, then in VS Code: `File → Open Folder…` and select the `casino-demo` folder.

### 2. Set up the backend

Open a terminal in VS Code (`` Ctrl+` ``) and run:

```bash
cd server
npm install
cp .env.example .env
```

Open the new `.env` file and change `JWT_SECRET` to any long random string (this signs login sessions — keep it secret, keep it different per project).

Start the server:

```bash
npm start
```

You should see:

```
Demo casino server running on http://localhost:4000
```

Leave this terminal running. A `casino-demo.db` SQLite file will appear in `server/` — that's your local database, safe to delete any time to reset all accounts.

### 3. Set up the frontend

Open a **second** terminal in VS Code (`` Ctrl+Shift+` `` or the `+` icon in the terminal panel):

```bash
cd client
npm install
npm run dev
```

You should see a local URL, typically:

```
Local:   http://localhost:5173/
```

Open that URL in your browser.

### 4. Try it out

1. Click **Create a demo account**, pick a username and password.
2. You'll land in the lobby with 1,000 demo chips.
3. Try **Dragon & Tiger** or **Head or Tail** — instant, single-player rounds.
4. Try **Aviator** — open the same URL in a second browser tab (or a private/incognito window) and log in as a second demo account. Place bets on both tabs during the betting window and watch the shared multiplier climb for both players at once, each cashing out independently.

## How the "online multiplayer" part works

Dragon & Tiger and Coin Toss are single-player rounds resolved instantly by the server (this keeps the demo simple and is how most real quick-bet casino games work — you're not playing against other people directly, you're playing against the house odds).

Aviator is the multiplayer one: the server (`server/aviator.js`) runs one continuous loop — a betting window, then a shared flight where a multiplier climbs until a random crash point, then a short pause before the next round. Every connected browser is a client of the same Socket.IO room, so everyone sees the identical multiplier at the identical moment and can cash out whenever they choose, independent of everyone else.

## Project structure

```
casino-demo/
  server/
    index.js          → Express + Socket.IO entry point
    db.js              → SQLite schema (users, rounds)
    auth.js            → /api/auth/register, /login, /me
    games.js           → /api/games/dragon-tiger/play, /coin-toss/play, /history
    aviator.js         → Socket.IO namespace running the shared Aviator round
    middleware/auth.js → JWT verification middleware
  client/
    src/
      App.jsx           → routing + auth context
      api.js             → REST client
      socket.js          → Socket.IO client for Aviator
      pages/
        Login.jsx, Register.jsx, Lobby.jsx
        DragonTiger.jsx, Aviator.jsx, CoinToss.jsx
      styles.css          → visual theme
```

## Extending it

- Swap SQLite for Postgres/MySQL by changing `server/db.js` — the rest of the code only calls `db.prepare(...)`-style methods, so you'd rewrite that one file.
- Add more games by copying the pattern in `server/games.js` (a route that validates the bet, runs server-side RNG, updates balance, records history) and a matching page in `client/src/pages/`.
- Add a "daily bonus" endpoint that tops up balance once every 24 hours if you want returning players to always have chips to play with.

## A note on going further

If a real-money version is ever the goal: that path runs through a gambling license in a jurisdiction that issues them, a licensed payment processor (which will only onboard licensed operators), and KYC/age-verification for players — all business and legal steps that come before any code changes. Nothing in this codebase is set up for that, and connecting it directly to real payments as-is would not be legal in most places.
