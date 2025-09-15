# Memory
Hãy save những thông tin cần nhớ vào file này. >>>/workspaces/monopoly/monopoly-login-app/GEMINI.md

# Project Overview

This is an Angular application named `monopoly-login-app`, likely serving as a login interface for a larger Monopoly-themed system. It was generated using Angular CLI version 20.3.1. The project utilizes TypeScript for development, SCSS for styling, and integrates with Firebase via `@angular/fire`, suggesting a cloud-based backend for authentication or data storage.

# Building and Running

The project uses the Angular CLI for various development tasks.

## Development Server

To start the local development server:

```bash
ng serve
```

The application will be accessible at `http://localhost:4200/` and will automatically reload on code changes.

## Building for Production

To build the project for production deployment:

```bash
ng build
```

The compiled output will be located in the `dist/` directory.

## Running Tests

### Unit Tests

To execute unit tests using Karma:

```bash
ng test
```

### End-to-End Tests

For end-to-end testing:

```bash
ng e2e
```

Note: Angular CLI does not include an e2e testing framework by default; one needs to be configured separately.

# Development Conventions

*   **Styling:** SCSS is used for styling components.
*   **Code Formatting:** Prettier is configured for consistent code formatting, as indicated by the `prettier` configuration in `package.json`.
*   **TypeScript Configuration:** The project uses `tsconfig.app.json` for application-specific TypeScript settings and `tsconfig.spec.json` for test-specific configurations.
