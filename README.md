# SPMS — Squash Player Management System

A redesigned React application for players, trainers, doctors, and administrators. The original project uses Firebase directly; the uploaded archive did not contain a separate backend server, Firebase security rules, or sensor integration.

## Run locally

Requires Node.js and npm. Install dependencies from the project folder:

```bash
npm ci
npm start
```

Open http://localhost:3000. To configure your Firebase project, copy `.env.example` to `.env.local`, fill in your web-app configuration, and restart the dev server. The original Firebase web configuration remains as a fallback for compatibility. These are public configuration identifiers, not administrator credentials.

```bash
npm run build
npm test -- --watchAll=false --runInBand
npm run format
```

The production output is `build/`. Configure your host to serve `index.html` for client-side routes. The default deployment base is `/`.

## What changed

- Navy, teal, and white visual system; redesigned landing page, public directories, sign-in, registration, and all role workspaces.
- Persistent desktop navigation; mobile drawer with close button, backdrop, and Escape support. Active links track the router.
- Shared, consistent profile cards, forms, tables, loading states, error states, empty states, and search controls.
- Firebase Authentication replaces password queries against Firestore. Passwords are no longer stored in user documents or browser sessions. Password changes and reset emails use Firebase Auth.
- Role routes are guarded; startup validates the Firebase session. Malformed session data no longer crashes the app.
- Updating a different user's profile no longer overwrites the current user's session.
- Trainer requests, confirmations, sharing, removal, and doctor connections update both profiles in a Firestore transaction. Duplicate relationships are prevented. Feedback uses an atomic array update.
- Announcements use the ID returned by Firestore, so a newly created announcement can be removed without reloading.
- Registration validates password confirmation, contact details, birth dates, and profile images; trainer experience is saved to the correct field. Age is derived from birth date.
- Health pages read saved `healthRecords`, sort by date, and filter by date. Fabricated measurements and sleep values were removed.
- The hard-coded fee records, fake payment download links, and non-working fee-upload controls were removed. There is no payment backend in the source archive.
- AI responses render as text, preventing HTML injection. Duplicate sends are blocked. The hard-coded provider key was removed; AI now requires an authenticated server endpoint.
- Profile removal cleans up reciprocal relationships and the public directory. It does not delete a Firebase Authentication account or automatically delete historical prompts; those require a trusted administrative service and your retention policy.

## Firebase setup required

1. Enable **Email/Password** in Firebase Authentication and configure authorized domains.
2. User documents must use the Auth UID: `users/{uid}`. Administrator records use `Admin/{uid}` and must be provisioned by a trusted administrator, never by self-registration.
3. A new `directory/{uid}` collection contains intentionally public professional-profile fields. Public directory pages read this collection rather than exposing private `users` documents. Registration and profile updates maintain the directory.
4. Configure Firestore and Storage rules in your Firebase project. Existing rules were not included in the upload and have not been verified or changed here. Client route guards and action checks are UI safeguards; they do not replace backend authorization.
5. Private `users` data must be restricted to the owner, authorized care relationships, and administrators. Scope relationship changes to the actor and exact permitted fields; prevent arbitrary role changes, feedback edits by players, or self-created Admin records. For strict privacy, move reciprocal relationship mutations and feedback to a trusted endpoint so professionals do not need broad access to private profile documents.
6. Public access should be limited to approved `directory` fields. Updates and tournaments should be readable by signed-in accounts and writable only by administrators. Prompts must be owner-only. Permit a signed-in account to check its own `Admin/{uid}` membership, including a missing document; deny client writes to that collection.
7. Require authentication for Storage uploads and validate owner path, image type, and maximum size. New uploads are stored below `spms/{uid}/...`.

No production Firebase writes, user migrations, password resets, rule deployments, or service connections were performed during this update.

### Migrating existing accounts

The original app used random Firestore IDs and plaintext passwords; the new version intentionally does not fall back to that mechanism. Existing accounts must be migrated before they can sign in.

- Back up Firestore and review the current rules first.
- Create or identify a Firebase Authentication account for each existing email. Use a password-reset flow; do not copy the old plaintext passwords.
- Make a JSON object mapping **every** old user document ID to its verified existing Auth UID. Even already migrated profiles need an explicit identity mapping. Keep the file private and outside source control.
- Install the optional trusted tooling with `npm install --prefix scripts` and set `GOOGLE_APPLICATION_CREDENTIALS` to your administrator credentials outside this project.
- Validate without writing:

```bash
node scripts/migrate-legacy.cjs /absolute/path/to/private-mapping.json
```

- After reviewing the mapping and backup, an authorized administrator can apply it:

```bash
node scripts/migrate-legacy.cjs /absolute/path/to/private-mapping.json --apply
```

The script verifies Auth emails, remaps player/trainer/doctor references and prompt ownership, rebuilds directories, removes profile password fields, and commits one atomic batch. It stops on missing mappings, target collisions, or more than 500 operations. Larger datasets need a dedicated migration service. It does not create Auth accounts or migrate Admin records. Provision administrator Auth UIDs separately. This script was syntax-checked but not executed against live data.

## Health data contract

The frontend has no sensor ingestion service. Populate a player's `healthRecords` using an authorized backend integration:

```json
{
  "healthRecords": [
    { "date": "2026-10-21", "heartBeat": 72, "steps": 4000, "temperature": 98.6 }
  ]
}
```

The example is a schema example, not actual patient data. Dates are ISO date strings, heart rate is bpm, and temperature is Fahrenheit. Missing readings show an em dash. No medical interpretation is calculated. Trainer access requires both confirmation and player sharing; doctor access follows the player's doctor connection.

## Optional AI endpoint

Leave `REACT_APP_AI_ENDPOINT` blank to show an honest unconfigured state. If you supply an endpoint, implement this contract on a trusted server:

- `POST` JSON `{ "question": "..." }`.
- Validate the `Authorization: Bearer <Firebase ID token>` token on the server.
- Apply server-side input limits, rate limits, and account permissions.
- Keep the provider API key on the server. Do not use a `REACT_APP_` variable for provider secrets.
- Return JSON `{ "answer": "..." }`; allow the frontend origin through your CORS policy.

The client times out after 45 seconds and stores successful conversations under the signed-in user. No AI proxy server is included. Rotate the provider key exposed in the original source through your provider account.

## Validation and limits

The production build and automated regressions cover session corruption, route access, reciprocal connections, duplicate prevention, feedback access checks at the API layer, announcement IDs, profile cleanup, and real health-date filtering. Unit tests mock Firebase; they do not validate deployed rules, storage permissions, Auth settings, live email delivery, AI service availability, sensor ingestion, or production data migration. See `VALIDATION.md` for the final check results.

The project keeps the original Create React App build system and React/Bootstrap architecture to reduce migration scope. Updating the entire build toolchain is a separate task.
