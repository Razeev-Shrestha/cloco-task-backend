# Getting Started with the Backend

This project is a backend application built using **Bun**, **ElysiaJS**, **TypeScript**, and **PostgreSQL**. Follow these steps to get the project running.

## Prerequisites

- **Docker (Optional):** If you prefer not to install Bun and PostgreSQL manually, you can use Docker.
- **Bun:** Make sure Bun is installed globally. [Installation Guide](https://bun.sh/)
- **PostgreSQL:** Ensure you have a PostgreSQL database running.

## Environment Configuration

1. **Environment Variables:**
   - The example environment variables are provided in the `.env.example` file. Use this file as a reference.
   - Create a `.env.development` file in the root directory for your local environment configuration.

   Example command to copy:
   ```bash
   cp .env.example .env.development
   ```

2. **Database Setup:**
   - Make sure your PostgreSQL database is running and matches the configuration in your `.env.development` file.

## Database Migrations

The database schema is defined in the `schema.sql` file located in the `src/db` directory. To apply migrations:

1. Open your PostgreSQL CLI.
2. Copy each block of SQL from the `schema.sql` file and execute it manually.

Example:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);
```

Run the above SQL block in your database CLI.

## Running the Project

You have two options to run the project: **Docker** or **Local Setup**.

### Option 1: Using Docker

1. Make sure Docker is installed on your system.
2. Run the following command to build and start the containers:
   ```bash
   docker-compose up --build
   ```

This will automatically set up the application and the PostgreSQL database inside Docker containers.

### Option 2: Running Locally

1. **Install Dependencies:**
   ```bash
   bun install
   ```

2. **Start the Application:**
   ```bash
   bun run dev
   ```

The application will start, and you can access it locally.

## Additional Notes

- **Code Structure:**
  - `src/config`: Contains configuration files.
  - `src/db`: Database-related utilities and queries.
  - `src/plugins`: ElysiaJS plugins used in the application.
  - `src/routes`: API route handlers.
  - `src/types`: TypeScript type definitions.
  - `src/utils`: Utility functions.

- **Scripts:** The `package.json` includes useful scripts for linting, building, and running the project.

## Troubleshooting

- Ensure the database connection details in `.env.development` are correct.
- If Docker is used, verify the containers are running using:
  ```bash
  docker ps
  ```


