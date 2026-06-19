# Chat setup (Firebase Realtime Database)

Messages are stored in **Firebase Realtime Database**; all other data stays in
**MongoDB**. Writes go through the backend (JWT-authenticated), which persists to
RTDB and broadcasts the saved message to connected clients over **Socket.IO**.

```
Browser ──POST /api/chat/messages──▶ Backend ──write──▶ Firebase RTDB (/messages/{groupId})
   ▲                                   │
   └────────── Socket.IO  ◀────────────┘  (backend broadcasts the saved message)
```

## One-time setup

1. **Firebase console → Project settings → Service accounts → "Generate new
   private key"**. This downloads a JSON file.
2. Save it as `backend/serviceAccountKey.json` (already gitignored — never commit it).
3. Confirm `backend/.env` has:
   ```
   FIREBASE_DATABASE_URL=https://but-together-default-rtdb.firebaseio.com
   FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./serviceAccountKey.json
   ```
   (For hosting where you can't ship a file, paste the JSON or its base64 into
   `FIREBASE_SERVICE_ACCOUNT_JSON` instead.)
4. Restart the backend (`npm run dev`). On boot you should see
   `Firebase Admin initialized (Realtime Database ready)`. Until the key is
   present, chat endpoints return `503` and the app runs normally otherwise.

## Recommended RTDB security rules

The browser never talks to Firebase directly — only the backend (Admin SDK,
which bypasses rules) does. So lock the database down completely:

```json
{
  "rules": { ".read": false, ".write": false }
}
```

## Data shape

`/messages/{groupId}/{messageId}`:
```json
{
  "senderId": "<mongo user id>",
  "senderName": "Ankit",
  "content": "Hello",
  "replyTo": { "id": "...", "name": "...", "content": "..." },
  "createdAt": 1716800000000
}
```

## API

- `POST /api/chat/messages` — body `{ groupId, content, replyTo? }` (auth required)
- `GET  /api/chat/messages/:groupId?limit=100` — history, oldest-first (auth required)

Socket.IO namespace `/chat` (JWT in `auth.token`): emit `join_group`/`leave_group`
with a `groupId`; listen for `new_message`.
