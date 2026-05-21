# DevPulse Backend

DevPulse is a backend API for an internal tech issue and feature tracking system.  
It allows users to register, login, create issues, view issues, update issues, and delete issues based on user role.

This project follows the assignment requirement of using Express modular architecture, PostgreSQL with native `pg`, raw SQL queries, JWT authentication, and role-based authorization. :contentReference[oaicite:0]{index=0}

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- pg
- Raw SQL
- bcrypt
- jsonwebtoken
- cookie-parser
- cors
- dotenv
- http-status-codes

---
## API Routes

| No. | Method | Route | Access | Description |
|-----|--------|-------|--------|-------------|
| 1 | POST | `/api/auth/signup` | Public | Register a new user as contributor or maintainer |
| 2 | POST | `/api/auth/login` | Public | Login user and generate access token and refresh token |
| 3 | POST | `/api/issues` | Contributor, Maintainer | Create a new bug or feature request |
| 4 | GET | `/api/issues` | Public | Get all issues with optional sort, type, and status filter |
| 5 | GET | `/api/issues/:id` | Public | Get a single issue by ID |
| 6 | PATCH | `/api/issues/:id` | Contributor, Maintainer | Update issue title, description, type, and maintainer can update status |
| 7 | DELETE | `/api/issues/:id` | Maintainer only | Delete an issue permanently |

## Project Architecture

This project follows a modular pattern.

```txt
Route -> Controller -> Service -> Database