<!--
- Version change: None -> 1.0.0
- Added sections: Core Principles, Technology & Architecture, Development Practices, Governance
- Modified principles: N/A (initial creation)
- Removed sections: N/A (initial creation)
- Templates requiring updates: None
- Follow-up TODOs: None
-->

# GyaanSetu Backend Constitution

## Core Principles

### I. API-First and RESTful Design
All features must be exposed via a well-defined RESTful API. Development shall adhere to the API Design Principles outlined in the PRD, including Richardson Maturity Model Level 2, standard HTTP verb usage, and clear resource naming conventions (`/api/v1/resource`).

### II. Layered and Modular Architecture
The codebase must strictly follow the layered architecture (Routes, Controllers, Services, Models). Business logic must be encapsulated within the Services layer, completely separate from controller and database model implementations to ensure separation of concerns and maintainability.

### III. Type Safety and Code Quality (NON-NEGOTIABLE)
All code must be written in TypeScript with strict typing. Runtime validation using libraries like Zod is mandatory for all incoming request data (bodies, params, queries) at the controller or middleware layer. Code must adhere to the project's ESLint and Prettier configurations.

### IV. Offline-First and Low-Bandwidth by Design
Every endpoint and data structure must be designed with offline synchronization and low-bandwidth environments in mind. This includes support for bulk/batch operations, response field filtering (`?fields=...`), and pagination to minimize data transfer. This is a primary requirement for serving our users.

### V. Comprehensive Testing
A test-first approach is highly encouraged. All new business logic in the service layer must be covered by unit tests (Jest). All API endpoints must have corresponding integration tests (Supertest) that validate the request/response cycle, authentication, and error handling.

## Technology & Architecture

### Tech Stack
The project must use the established technology stack unless an amendment to this constitution is approved. The stack includes Node.js (v22+), Express.js (v5+), TypeScript, MongoDB (v7+), and Mongoose (v9+). All services must be containerized using Docker for environment consistency.

### System Architecture
The system will follow the high-level architecture defined in the PRD, including the API Gateway, Application Layer, Data Layer, and integration with external services like AWS S3 and CloudFront. Changes to this core architecture require a formal review.

## Development Practices

### Versioning
The API will use URL-based versioning (e.g., `/api/v1`, `/api/v2`). Any change that is not backward-compatible requires a new API version.

### Code Reviews
All code must be reviewed via a Pull Request before being merged into the main branch. Reviews must verify compliance with all principles in this constitution.

### Documentation
API endpoints must be documented using OpenAPI/Swagger. Complex business logic within services should be accompanied by clear comments explaining the 'why', not the 'what'.

## Governance

This constitution is the single source of truth for all development standards and practices. It supersedes any other informal agreements. Amendments to this document require a Pull Request, team review, and approval from the project stakeholders. All development activity, PRs, and reviews must verify compliance with this constitution.

**Version**: 1.0.0 | **Ratified**: 2025-12-25 | **Last Amended**: 2025-12-25