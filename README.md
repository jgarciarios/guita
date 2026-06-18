# Time is Money

A local-first personal finance app built for one purpose: logging an expense in
under 5 seconds. No friction, no cloud, full privacy.

## Why

Most finance trackers get abandoned because logging a transaction is tedious.
Time is Money optimizes for the one action that matters — fast entry — and keeps
all data on your device.

## Features

- Add income/expenses in seconds via a quick-entry panel
- Running balance and chronological movement list
- 100% local persistence — works offline, data never leaves the browser
- Custom dark UI (no off-the-shelf component library)

## Stack

- Vite + React + TypeScript
- SQLite (WASM) running on OPFS for local persistence
- IBM Plex Sans / Mono, self-hosted

## Architecture decisions

- **Local-first.** Data lives in an in-browser SQLite database (OPFS), no backend.
  Privacy by default; cloud sync is an opt-in future phase.
- **Repository pattern.** The UI depends on a `TransactionRepository` interface,
  not a concrete store. Two implementations (in-memory and SQLite) are swappable
  without touching the UI — which is exactly how the SQLite layer was added.
- **Money as integer cents.** Amounts are stored as integers in the smallest unit,
  never as floats, to avoid rounding errors in financial calculations.
- **Custom design system.** Tokens-based theming (CSS variables) instead of a UI
  kit, for a distinct look rather than a templated one.

## Run locally

```bash
npm install
npm run dev
```

## Roadmap

- [x] Local data layer + transaction list
- [x] Quick-entry form
- [ ] Monthly dashboard and metrics
- [ ] Optional cloud sync