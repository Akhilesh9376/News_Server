# News Application Backend

This is the backend for a simple news application, built with Node.js, Express, and TypeScript. It provides a RESTful API for managing news articles and employee authentication.

## Features

- Employee authentication (registration and login) using JWT.
- CRUD operations for news articles.
- Protected routes for creating, updating, and deleting news.
- Public routes for reading news.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **jsonwebtoken**: For generating and verifying JSON Web Tokens.
- **bcryptjs**: For hashing passwords.

## Project Structure
server-backend/
├── src/
│   ├── config/         # Configuration files (e.g., database)
│   ├── controllers/    # Request handlers and business logic
│   ├── middleware/     # Express middleware (e.g., authentication)
│   ├── models/         # Mongoose models and schemas
│   ├── routes/         # API route definitions
│   └── index.ts        # Main server entry point
├── .env                # Environment variables
├── package.json
└── tsconfig.json

## API Endpoints
### Authentication

- `POST /api/auth/register`: Register a new employee.
- `POST /api/auth/login`: Log in an employee and get a JWT token.
- `POST /api/auth/logout`: Log out an employee (invalidates token).

### News Articles

- `GET /api/news?page=1&limit=10`: Get all news articles with pagination (Public).
- `GET /api/news/category/:category?page=1&limit=10`: Get news articles by category with pagination (Public).
- `GET /api/news/:id`: Get a single news article by ID (Public).
- `POST /api/news`: Create a new news article (Protected).
- PUT /api/news/:id : Update a news article (Protected).
- DELETE /api/news/:id : Delete a news article (Protected).
To access protected routes, you need to include the JWT token in the x-auth-token header of your request.

## Environment Variables

Set these in `.env`:

- `PORT` — Server port (default `5000`)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret key for signing JWTs
- `JWT_EXPIRES_IN` — JWT expiration window (e.g., `1h`, `2h`, `3600s`)