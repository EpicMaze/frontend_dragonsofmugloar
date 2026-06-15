# Dragons of Mugloar

A web application built for tech evaluation project, using [Dragons of Mugloar API](https://www.dragonsofmugloar.com/).

## Stack

- **Vue 3** with Composition API and TypeScript
- **Pinia**: state management with persistence
- **TanStack Query**: server state, caching, optimistic updates
- **Vue Router**: client-side routing with route guards
- **Tailwind CSS v4** and shadcn-vue: styling and UI components
- **Vitest** and Vue Test Utils: unit testing
- **oxlint** and **ESLint**: dual linting (oxlint for speed, ESLint for Vue/TS rules)
- **Husky** and **lint-staged**: pre-commit hooks
- **Prettier**: code formatting
- **Vite**: build tooling

## Features

- Start and continue game sessions with persistent state for page refreshes.
- Browse and solve messages from the ad board.
- Purchase items from the shop.
- Track score, gold, lives, level and turn in real time.
- **Turns remaining indicator**: calculates remaining turns before a message expires client-side using `fetchTurn + expiresIn - currentTurn` formula.
- **Message Risk Analysis**: evaluates each message solve probability based on difficulty and encryption. Provides a risk score (SAFE -> CRITICAL) with breakdown tooltip.
- **Ad Decryption**: decodes encrypted message in-place with toggle.
- Game over handling for both session expiry and lives lost, with final stats display.

## Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm `10` or later

### Installation

```bash
git clone <repo>
cd frontend_dragonsofmugloar
npm install
```

### Environment

Copy example `.env` files from project root:

```bash
cp .env.example .env
cp .env.test.example .env.test
```

### Running the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Running tests

```bash
npm run test
```

### Building for production

```bash
npm run build
```

### CI Validation

Run the full validation pipeline locally:

```bash
npm run ci
```

This runs type checking, linting, tests and build in sequence.

## Development

### Pre-commit hooks

The project uses Husky + lint-staged for pre-commit validation:

- Prettier formats staged files
- ESLint fixes staged files
- TypeScript type check runs on commit

Hooks are installed automatically after `npm install` via the `prepare` script.

## Project Structure

```bash
src
├───api
├───components
│   └───game
├───composables
├───lib
├───router
├───service
├───stores
├───test
│   ├───api
│   ├───components
│   ├───composables
│   ├───integration
│   ├───stores
│   ├───utils
│   └───views
└───views
```

## Architecture Notes

- **Domain naming**: API messages are modeled as `Ad` internally, matching the `adId` identifier used throughout the API, while UI layer uses "messages" and "tasks" for player clarity.
- **Optimistic updates**: ads are removed from the UI immediately on solve attempt, regarding the result, and on 400 errors.
  - `result.success = true | false` on solving treated as done task and no need for it to remain UI.
  - `400` on solving treated as message expiry (contractor left) for game mechanics, not a generic error. Assumption is made that `400` throw happens when message would have been expired by the time of solve attempt or during.
  - other errors on solving treated as network issues, triggering rollback.
- **Global error handling**: 410 (game lost) and 404 (session expired) are caught globally in TanStack Query cache handlers and trigger game-over flow.
- **Persistent state**: game session, reputation and game-over state survive page refresh via Pinia persistence plugin.

## Notes

- Mobile: fully functional on mobile devices. Desktop layout recommended for optimal experience.
- Originally prototyped in React, Redux Toolkit, React Query, ported to Vue 3 as part of the evaluation. React version available on request.
