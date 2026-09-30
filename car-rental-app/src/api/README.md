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

## The backend

`DATA_SOURCE` in `config.ts` is `'backend'`. Set it to `'fixtures'` to run the
car and booking screens against in-memory data instead; `api.auth` always uses
the backend.

A `Car` in the app is a row of `listings`: a vehicle, offered by a brand (the
rental company), at a location, at a daily price. `backend/records.ts` is the
only file that knows the field names.

| App model | Collection | Fields used                                                                             |
| --------- | ---------- | --------------------------------------------------------------------------------------- |
| `Car`     | `listings` | `daily_price`, expanded `vehicle_id` (make, model, category), `brand_id`, `location_id` |
| `Booking` | `bookings` | `user_id`, `listing_id`, `start_date`, `end_date`, `total_price`                        |

Things the schema does not have, and how the app copes:

- **Booking status**: derived. A booking is `completed` once `end_date` has
  passed.
- **`fullName` / `phone`**: collected by the booking form but not stored, as
  `bookings` has no columns for them.
- **Server-side pricing**: `total_price` is required, so the client computes it
  from the listing's stored `daily_price`. A PocketBase hook should own this.

Required API rules: `listings`, `vehicles`, `locations` and `brands` readable
by the app, and `bookings` scoped to `user_id = @request.auth.id`.
