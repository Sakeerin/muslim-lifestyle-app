# Phase 1: API Interface Specification

Base path: `/api`
Response format: JSON

## Conventions

- Success: `2xx` with `{ data, meta? }`
- Error: non-`2xx` with `{ error: { code, message, details? } }`
- Pagination params: `page`, `limit`

## Public Endpoints

### GET `/api/prayer-times`

- Purpose: Return prayer times for a date and location.
- Query:
  - `lat` (number, required)
  - `lng` (number, required)
  - `date` (ISO date, optional)
  - `method` (string, optional)
- Response:
  - `data.timings` (fajr, dhuhr, asr, maghrib, isha)
  - `data.location`

### GET `/api/lessons`

- Purpose: List published lessons.
- Query:
  - `page` (number, optional)
  - `limit` (number, optional)
  - `category` (string, optional)
  - `q` (string, optional)
- Response:
  - `data[]` lesson summaries
  - `meta` pagination

### GET `/api/lessons/:slug`

- Purpose: Lesson detail by slug.

### GET `/api/duas`

- Purpose: List duas.
- Query:
  - `category` (string, optional)
  - `q` (string, optional)

### GET `/api/places/proximities`

- Purpose: Combine OSM + verified local DB places near coordinate.
- Query:
  - `lat` (number, required)
  - `lng` (number, required)
  - `radius` (number in meters, optional)
  - `type` (`MOSQUE` | `HALAL_FOOD`, optional)

## Admin Endpoints (Auth Required)

### Lessons

- `POST /api/admin/lessons`
- `PATCH /api/admin/lessons/:id`
- `DELETE /api/admin/lessons/:id`

### Duas

- `POST /api/admin/duas`
- `PATCH /api/admin/duas/:id`
- `DELETE /api/admin/duas/:id`

### Places

- `POST /api/admin/places`
- `PATCH /api/admin/places/:id`
- `DELETE /api/admin/places/:id`

## Security/Validation

- Admin routes require authenticated session with `ADMIN` role.
- Validate all input payloads server-side (planned with Zod).
- Rate-limit public aggregation endpoints (e.g., places/proximities).
