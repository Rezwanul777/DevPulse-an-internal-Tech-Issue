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

## Project Architecture

This project follows a modular pattern.

```txt
Route -> Controller -> Service -> Database