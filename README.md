# Backend Application

A backend API built with **Express**, **TypeScript**, and **Prisma** for managing tasks. It includes basic CRUD operations and validation.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setting up the Database](#setting-up-the-database)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Scripts](#scripts)
- [License](#license)
- [Contributing](#contributing)

---

## Features

- RESTful API for task management.
- CRUD operations for tasks with validation.
- TypeScript for type safety.
- Prisma as the ORM for database operations.
- CORS support for cross-origin requests.

---

## Technologies Used

- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: Static typing
- **Prisma**: ORM for database management
- **Express Validator**: Request validation
- **Nodemon**: Development server auto-reload

---

## Getting Started

### Prerequisites

- Node.js (v20.x recommended)
- npm or yarn
- Docker (to set up MySQL database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/italogamainc/backend.git
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Setting up the Database

To create and set up a MySQL database using Docker, follow these steps:

1. Run the following command to create a MySQL database container:

   ```bash
   docker run --name todo-db -p 3306:3306 -e MYSQL_DATABASE=todo-db -e MYSQL_USER=admin -e MYSQL_PASSWORD=123456 -e MYSQL_ROOT_PASSWORD=rootpassword mysql:8
   ```

2. After the container is running, execute the following commands to set up the database and user privileges:

   ```bash
   docker exec -it todo-db mysql -u root -p
   ```

   Inside the MySQL shell, run:

   ```sql
   USE todo-db;
   GRANT ALL PRIVILEGES ON `todo-db`.* TO 'admin'@'%';
   FLUSH PRIVILEGES;
   ALTER USER 'admin'@'%' IDENTIFIED BY '123456';
   GRANT CREATE, DROP ON *.* TO 'admin'@'%';
   FLUSH PRIVILEGES;
   ```

3. **Why are these privileges needed?**  
   Prisma requires certain privileges for managing its migrations and creating a shadow database. The `npx prisma migrate dev` command creates a shadow database to ensure the migration process runs smoothly, and for this, the user needs `CREATE` and `DROP` permissions.

4. Generate Prisma Client and apply migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

---

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
DATABASE_URL="mysql://admin:123456@localhost:3306/todo-db"
FRONTEND_URL="http://localhost:3000" # or your frontend URL
PORT=3010
```

### Running the Application

- **Development mode**:
  ```bash
  npm run dev
  ```
- **Build and Start**:
  ```bash
  npm run build
  npm start
  ```

---

## API Endpoints

### Task Endpoints

#### Get all tasks

- **URL**: `/tasks`
- **Method**: `GET`
- **Response**: Array of tasks

#### Get a task by ID

- **URL**: `/tasks/:id`
- **Method**: `GET`
- **Params**:
  - `id` (integer, required): Task ID
- **Response**: Task object or `404` if not found

#### Create a new task

- **URL**: `/tasks`
- **Method**: `POST`
- **Body**:
  - `title` (string, required, max 150 characters)
  - `color` (string, required, max 7 characters, e.g., `#FFFFFF`)
- **Response**: Created task object

#### Update a task

- **URL**: `/tasks/:id`
- **Method**: `PUT`
- **Params**:
  - `id` (integer, required): Task ID
- **Body**:
  - `title` (string, optional, max 150 characters)
  - `color` (string, optional, max 7 characters, e.g., `#FFFFFF`)
  - `completed` (boolean, optional)
- **Response**: Updated task object or `404` if not found

#### Delete a task

- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Params**:
  - `id` (integer, required): Task ID
- **Response**: Success message or `404` if not found

---

## Scripts

- `npm run dev`: Start the app in development mode with auto-reload.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm start`: Run the compiled app.
- `npm run prisma:migrate`: Deploy database migrations with Prisma.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
