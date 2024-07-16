# Exercise Tracker Microservice

This is an Exercise Tracker Microservice built with Node.js, Express, and MongoDB for freeCodeCamp.

## Endpoints

- `POST /api/users`: Creates a new user.
- `GET /api/users`: Retrieves all users.
- `POST /api/users/:_id/exercises`: Adds an exercise for a user.
- `GET /api/users/:_id/logs`: Retrieves a user's exercise log.

### Example Usage

- `POST /api/users` with form data username
- `POST /api/users/:_id/exercises` with form data description, duration, and optionally date
- `GET /api/users/:_id/logs`

### Example Output

**Exercise:**
```json
{
  "username": "fcc_test",
  "description": "test",
  "duration": 60,
  "date": "Mon Jan 01 1990",
  "_id": "5fb5853f734231456ccb3b05"
}
