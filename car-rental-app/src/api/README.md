# API layer (FR-01)

Every data query in the app goes through here. Outside `src/api/`, nothing
imports `pocketbase`, names a collection, or knows an HTTP status code.

```ts
import { api } from '../api';

const offers = await api.cars.listHighlighted();
```

## Files

| File          | Role                                                                  |
| ------------- | --------------------------------------------------------------------- |
| `index.ts`    | Assembles and exports `api`. **The only module the app imports.**     |
| `contract.ts` | Domain models (`Car`, `Booking`, `AuthUser`) and the `Api` interface. |
| `config.ts`   | Base URL, collection names, and the `DATA_SOURCE` switch.             |
| `client.ts`   | The single PocketBase instance and its session-scoped token store.    |
| `errors.ts`   | `ApiError` + `toApiError()`: one error type, displayable messages.    |
| `pricing.ts`  | `rentalDays()` / `estimateTotal()` for client-side previews.          |
| `backend/`    | The real implementation, against PocketBase.                          |
| `fixtures/`   | An in-memory implementation of the same contract.                     |

## How it fits together

`contract.ts` defines _what_ can be queried; `backend/` and `fixtures/` are two
implementations of it; `index.ts` picks one per resource:

```
screens ──▶ api (index.ts) ──┬──▶ backend/ ──▶ client.ts ──▶ PocketBase
                             └──▶ fixtures/ (in memory)
```

Because the screens only ever see the `Api` interface, swapping implementations
is a change to `index.ts` — no screen changes.

## Current state of the backend

Only authentication works. `api.auth` therefore always uses `backend/auth.ts`,
while `api.cars` and `api.bookings` follow `DATA_SOURCE` in `config.ts`, which
defaults to `'fixtures'`.

| Collection                                     | State                                                |
| ---------------------------------------------- | ---------------------------------------------------- |
| `users`                                        | Readable; `authWithPassword` works.                  |
| `vehicles`, `providers`, `locations`, `brands` | Exist, but list/view rules are superuser-only (403). |
| `bookings`                                     | Does not exist.                                      |

## Switching to the real backend

1. In PocketBase, open the list/view rules on `vehicles`, `providers`,
   `locations` and `brands` (e.g. `@request.auth.id != ""`).
2. Create a `bookings` collection with `user` (relation → users), `vehicle`
   (relation → vehicles), `start`, `end`, `totalPrice`, `status`, `fullName`,
   `phone`, and rules scoped to `user = @request.auth.id`.
3. Correct `backend/records.ts` to the real field names — it is the only file
   that assumes any.
4. Set `DATA_SOURCE = 'backend'` in `config.ts`.
