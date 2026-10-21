# Validation — 21 October 2026

- `npm ci --no-audit --no-fund`: passed with the supplied lockfile. The lockfile was subsequently updated when explicit formatting and Babel build dependencies were added.
- `npm run build`: production compilation passed. Create React App emits existing environment/toolchain notices about its Browserslist data and Node deprecations.
- `CI=true npm test -- --watchAll=false --runInBand`: 27 tests passed across 4 suites.
- Migration script: `node --check scripts/migrate-legacy.cjs` passed. No live migration was run.

The regression tests cover corrupt session recovery, credential stripping, exact role matching, own-account session updates, password changes through Firebase Auth, atomic reciprocal trainer updates, confirmation and sharing flags, duplicate trainer and doctor connections, connection removal, unauthorized client actions, missing related profiles, saved announcement IDs, registration password mismatch, profile-link cleanup, exact birthday age calculation, feedback validation, route redirects, mobile menu state, and health date filtering.

Browser checks use a locally installed Chromium through Playwright. Public pages are checked at 1440px and 390px widths for rendering and horizontal overflow. Form validation, role switching, and signed-out route redirection are exercised without submitting credentials or creating accounts. Dashboard visual review uses a static render from mocked data; it does not verify live Firebase integration.

Backend limitations: no verified production Firebase rules, no live account migration, no live Firebase sign-in or uploads, no live AI endpoint, and no sensor integration. Firebase permissions and the Auth UID migration described in README.md must be completed before using existing data with this revision.
