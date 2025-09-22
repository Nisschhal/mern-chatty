# MERN CHATTY

## Overview

MERN CHATTY is a real-time chat application built using the MERN stack (MongoDB, Express.js, React, Node.js). It supports user authentication (signup, login, logout) and messaging functionality, with plans to integrate Socket.io for real-time communication. The frontend uses Vanilla React with Vite for fast development, and the backend leverages Node.js, Express, and MongoDB with Mongoose for data persistence. Authentication is secured with JSON Web Tokens (JWT) and bcrypt for password hashing.

This project is designed to be beginner-friendly with clear setup instructions, making it accessible to developers and non-developers alike. It supports local development and deployment on Sevalla, a free hosting platform compatible with Socket.io.

## Features

- User authentication (signup, login, logout)
- Messaging system (get messages, send messages)
- Planned Socket.io integration for real-time chat (to be implemented)
- Secure password handling and JWT-based authentication
- Environment variable management for sensitive data
- Unified frontend and backend for streamlined deployment

## Tech Stack

### Frontend

- **React**: Vanilla React (no additional UI libraries)
- **Vite**: Fast development and bundling tool

### Backend

- **Node.js**: Server-side runtime
- **Express.js**: Web server framework
- **MongoDB with Mongoose**: Database and ORM
- **jsonwebtoken**: JWT for authentication
- **bcryptjs**: Password hashing
- **dotenv**: Environment variables (optional for Node.js v20.6.0+)
- **cookie-parser**: Cookie handling for auth

### Real-Time (Planned)

- **Socket.io**: For real-time messaging (to be added)

### Deployment

- **Sevalla**: Free hosting platform with Socket.io support

## Prerequisites

- **Node.js**: v20.6.0 or higher recommended
- **npm**: Included with Node.js
- **MongoDB**: Account (e.g., MongoDB Atlas for cloud-hosted database)
- **Git**: For version control

## Project Structure

The project is split into `frontend` and `backend` folders, merged under a root directory for deployment.

```
mern-chatty/
├── frontend/          # React app
│   ├── dist/          # Built static files (generated on build)
│   ├── src/           # Source code
│   ├── package.json   # Frontend dependencies and scripts
│   └── vite.config.js # Vite configuration
├── backend/           # Node.js/Express server
│   ├── src/           # Backend source
│   │   ├── controllers/ # API logic
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   │   ├── auth.route.js     # Auth endpoints (login, signup, logout)
│   │   │   └── message.route.js  # Message endpoints (get/send messages)
│   │   └── server.js    # Main server file
│   └── package.json     # Backend dependencies and scripts
├── .gitignore           # Git ignore rules
└── package.json         # Root package.json for combined build/deploy
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mern-chatty
```

### 2. Create .gitignore

Create a `.gitignore` file in the root directory:

```
node_modules
.env
frontend/dist
```

This ensures `node_modules`, `.env`, and built files are not committed to Git.

### 3. Frontend Setup

Navigate to the `frontend` folder:

```bash
cd frontend
```

- Initialize with Vite:

  ```bash
  npm create vite@latest .
  ```

  Select **React** and **JavaScript** when prompted.

- Install dependencies:

  ```bash
  npm install
  ```

- Run development server:
  ```bash
  npm run dev
  ```

The frontend will be available at `http://localhost:5173` (default Vite port).

### 4. Backend Setup

Navigate to the `backend` folder:

```bash
cd backend
```

- Initialize `package.json`:

  ```bash
  npm init -y
  ```

- Install dependencies:

  ```bash
  npm install express mongoose jsonwebtoken bcryptjs dotenv cookie-parser
  ```

- Create `src` folder and `server.js` file inside it.

- Update `package.json`:

  - Set `"main": "src/server.js"`
  - Add `"type": "module"` for ES6 imports/exports
  - Replace `"scripts"` with:
    ```json
    "scripts": {
      "dev": "node --watch src/server.js",
      "start": "node src/server.js"
    }
    ```

- Create folders: `controllers/`, `models/`, `routes/`.
- Add route files: `routes/auth.route.js` (for login, signup, logout) and `routes/message.route.js` (for get/send messages).

- In `src/server.js`, set up the Express server, connect to MongoDB, and define routes. (See deployment section for production config.)

- Run development server:
  ```bash
  npm run dev
  ```

The backend will listen on your specified port (e.g., 5000).

### 5. Environment Variables

Create a `.env` file in the `backend` folder:

```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
```

Replace `<your-mongodb-connection-string>` and `<your-secret-key>` with your MongoDB URI and a secure JWT secret.

## Development Workflow

- Run frontend (`npm run dev` in `frontend/`) and backend (`npm run dev` in `backend/`) separately for local development.
- Test API endpoints (e.g., `/api/auth/login`) using tools like Postman.

## Socket.io Integration (Planned)

Socket.io will be added for real-time messaging. Once implemented:

- Install `socket.io` in the backend: `npm install socket.io`
- Configure in `backend/src/server.js` for WebSocket connections
- Update frontend to handle real-time events
- Detailed setup will be added to this README when implemented

## Deployment

The project combines frontend and backend into a single deployable unit for Sevalla, which supports Socket.io for future real-time features.

### Why Sevalla?

- Free tier available
- Supports Socket.io (unlike Vercel/Netlify for WebSockets)
- Easy GitHub integration

### Deployment Steps

1. **Create Root package.json** (in project root):

   ```json
   {
     "scripts": {
       "build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
       "start": "npm run dev --prefix backend"
     },
     "engines": {
       "node": ">=20.0.0"
     }
   }
   ```

   - `build`: Installs dependencies for both folders and builds frontend to `dist/`.
   - `start`: Runs backend dev script (use `start` script for production).
   - `engines`: Ensures Node.js version compatibility for Sevalla.

2. **Configure Backend for Static Serving** (in `backend/src/server.js`):
   Serve frontend's `dist/` folder in production to handle client routes alongside API routes.

   ```javascript
   import path from "path"
   import express from "express"
   // ... other imports and setup ...

   const app = express()
   // ... middleware and routes ...

   const __dirname = path.resolve()
   const frontendDistPath = path.join(__dirname, "..", "frontend", "dist")

   if (process.env.NODE_ENV === "production") {
     app.use(express.static(frontendDistPath))
     app.get("*", (req, res) => {
       res.sendFile(path.join(frontendDistPath, "index.html"))
     })
   }

   // Note: For Express v5+, replace app.get('*', ...) with app.use(/(.*)/, ...)
   ```

   This enables client routes (e.g., `/login`) and API routes (e.g., `/api/auth/login`) on the same domain.

3. **Build the Project**:
   From root:

   ```bash
   npm run build
   ```

4. **Deploy to Sevalla**:
   - Sign up at [https://app.sevalla.com/](https://app.sevalla.com/) and connect your GitHub repo.
   - Set environment variables in Sevalla (e.g., `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`).
   - Deploy the project (may take a few minutes).
   - If you encounter errors like `Could not load /vite.svg` or Node version issues, ensure the `engines` field is set as above.
   - After deployment, visit the provided app URL.

### Deployment Notes

- This setup is for production; during development, run frontend and backend separately.
- Ensure `.env` variables are set in Sevalla’s dashboard and not committed to Git.
- Sevalla supports Socket.io natively, making it ideal for future real-time features.

## Contributing

Fork the repository and submit pull requests. Report issues via GitHub Issues.

## License

MIT License - free to use and modify.
