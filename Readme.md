# MERN CHATTY

Create a format for a chat app using MERN stack

- create frontend and backend
- create .gitignore file for git ignore
  - add node_modules and .env to the .gitignore file

## Frontend Requirements

- Vanilla React via vite

### Frontend Setup

1. React with Vite:
   - `npm create vite@latest .`
   - `npm install`
   - `npm run dev`

## Backend Requirements

- Node.js
- Express for server
- MongoDB with Mongoose for database
- jsonwebtoken for authentication
- bcryptjs for password hashing
- dotenv for environment variables
  - for latest version of node:>20.6.0, dotenv package may not required, as it is included with node
- cookie-parser for cookies

### Backend Setup

1. Node.js

   - `npm init -y`
   - `npm install express mongoose jsonwebtoken bcryptjs dotenv cookie-parser`

2. Create src folder and server.js file in it.

3. Configure package.json

   - change `"main: "src/index.js"`
   - replace the scripts with the following:
     - `"dev": "node --watch src/server.js"`
       ** this will run and watch the server.js file for development **
     - `"start": "node src/server.js"`
       ** this will run the server.js file for production **
   - add `"type": "module"` to the package.json file
     ** this will enable the use of ES6 modules i.e. import and export **

4. Folder structure

   - src
     - server.js
       - main file to spin up the server and listen for requests
     - controllers
     - models
     - routes
       - auth.route.js - for authentication routes: login, signup, logout
       - message.route.js - for message routes: get messages, send message
