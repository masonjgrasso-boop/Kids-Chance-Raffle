# Kids-Chance-Raffle
A live, multi-device raffle management web app built for the Kids' Chance of New Hampshire cornhole fundraiser event.

## What It Does

- **Sell tickets** — volunteers log buyer name, phone number, and ticket number range at point of sale
- **Look up winners** — type a drawn ticket number and instantly see who owns it
- **Notify winners by SMS** — one tap sends a text to the winner's phone via Textbelt
- **Live sync** — all volunteer devices share the same data in real time via Firebase Realtime Database
- **Password protected** — single password gate keeps the app volunteer-only

## Tech Stack

- **Frontend** — Vanilla HTML/CSS/JS, built with Vite
- **Database** — Firebase Realtime Database (live sync across all devices)
- **SMS** — Textbelt API via Firebase Cloud Function (keeps API key server-side)
- **Hosting** — Firebase Hosting at kids-chance-raffle.web.app

## Environment Variables

Create a `.env` file in the root with the following:
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

Create a `functions/.env` file with:
TEXTBELT_KEY=

## Local Development

```bash
cd Kids-Chance-Raffle
npm install
cd functions && npm install && cd ..
npm run dev
```

## Deployment

```bash
npm run build
firebase deploy
```

## Key Files

- `index.html` — main app (sell, lookup, ledger tabs)
- `functions/index.js` — Cloud Function that proxies SMS to Textbelt
- `firebase.json` — hosting and rewrite config
- `database.rules.json` — Firebase Realtime Database security rules

## Event Day Usage

1. Share **kids-chance-raffle.web.app** with all volunteers
2. Password is **1988**
3. One volunteer handles all ticket sales entry
4. When a ticket is drawn, type the number in the Lookup tab
5. Hit Notify Winner to send an SMS to the winner automatically
