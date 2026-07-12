# TransitOps

TransitOps is a Smart Transport Operations Platform being developed for the Odoo Hackathon 2026.

The goal is to build an end-to-end transport management system that digitizes vehicle, driver, dispatch, maintenance, fuel, expense, and reporting workflows while enforcing real-world business rules through a modular ERP-style architecture.

## Repository

https://github.com/Anindita-23/odoo-hackathon

## Project Status

This project is currently under active development.

Current progress:
- [x] Repository initialized
- [x] Frontend setup
- [ ] Backend setup
- [ ] Database schema
- [ ] Authentication & RBAC
- [ ] Vehicle Management
- [ ] Driver Management
- [ ] Trip Management
- [ ] Maintenance Module
- [ ] Fuel & Expense Module
- [ ] Dashboard
- [ ] Reports & Analytics
- [ ] Testing & Bug Fixes

## Planned Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- JWT
- bcrypt

## Planned Project Structure

```
TransitOps/
│
├── frontend/
├── backend/
├── docs/
├── README.md
└── .gitignore
```

## Core Modules

- Authentication & RBAC
- Dashboard
- Vehicle Registry
- Driver Management
- Trip Management
- Maintenance
- Fuel Logs
- Expense Management
- Reports & Analytics

## Database Entities

- Users
- Roles
- Vehicles
- Drivers
- Trips
- MaintenanceLogs
- FuelLogs
- Expenses

## Team

| Member | Responsibilities |
|---------|------------------|
| Shraddha | Frontend Development & UI |
| Saloni | Backend Development, Database Design & Authentication |
| Anindita | Business Logic, APIs & Workflow Implementation |

## Development Workflow

- `main` – Stable code
- `develop` – Integration branch
- `feature/*` – Individual feature branches

## Setup

Clone the repository:

```bash
git clone https://github.com/Anindita-23/odoo-hackathon.git
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Notes

- PostgreSQL is used as the primary relational database.
- Prisma ORM is used for database access and migrations.
- The project follows a modular architecture with separation of controllers, services, repositories, and database models.
- Business rules are enforced at the service layer.
- This README will be updated as development progresses.