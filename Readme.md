b# MERN CHATTY

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

---

## Deployment Setup

<i> **The project content two folders: frontend and backend which have their own dependencies and scripts** </i>

So what we will do is merge them into one project and deploy it to sevalla.

- why sevalla?
  - because it's free
  - supports socket.io unlike vercel and netlify

---

### Deployment Process

1. Create a dist folder to get the static files i.e. index.html
2. Write code in backend/src/server.js to serve the static files from the dist folder
3. Create a root/package.json to install the dependencies for each folder and run the scripts for each folder

## Implmentation Detail

1.  Create a root/package.json to install the dependencies for each folder and run the scripts for each folder

    - add `"build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend"`
      **_This will install the dependencies for both frontend and backend and run the build script for frontend to create the dist folder_**
      </br>
    - add `"start": "npm run dev --prefix backend "`
      ** this will run the dev script for backend which is the main file to spin up the server and listen for requests, both client and server APIs **
      </br>

2.  Configure the backend/src/server.js file to serve the static files from the dist folder, i.e index.html as that is the entry point for the frontend

    1. Get the current working directory path as \_\_dirname
       Note: \_\_dirname is a global variable that points to the current working directory, in ES6 modules
       **_`But this is modules, so we need to use path.resolve() to get the current directory`_**
    2. Connect/Join the current working directory with the dist folder in the frontend folder to get the absolute path to the dist folder.
    3. Serve the static files from the dist folder, meaning tell the express you have to look for static files in the dist folder
       - if any request is made to the root path that is not '/api' or any other API route then that is client request, so send the index.html file from the dist folder
         </br>
    4. write the code to send the index.html file from the dist folder for non-API routes

    ```JS
        const __dirname = path.resolve()
         const frontendDistPath = path.join(\_\_dirname, "..", "frontend", "dist")
          if (process.env.NODE_ENV === "production") {
            app.use(express.static(frontendDistPath))
            app.get("*", (req, res) => {
              res.sendFile(path.join(frontendDistPath, "index.html"))
              })
          }
    ```

    **_Note: if you are using express version > 5.x.x replace _**

    `app.get("*",`

    **_with_**

    ` app.use(/(.*)/,`

    **_Because express version > 5.x.x does not support wildcard routes_**

    - This is now let you access client routes: `/`, `/login`, `/signup`, `/logout` and also server routes: `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout` in same domain

3.  Now create an account in sevalla with github, connect the repo and deploy the project there [https://app.sevalla.com/](https://app.sevalla.com/)

    - it is free
    - supports socket.io
    - it might take some time to deploy the project

      Caution: there might be error in deployment `error during build: Could not load /vite.svg (imported by src/App.jsx): crypto.hash is not a function` if you see this than you need to add
      add the following in root/package.json because of
      `You are using Node.js 18.20.5. Vite requires Node.js version 20.19+ or 22.12+. Please upgrade your Node.js version.`

    ```JS
      "engines": {
      "node": ">=20.0.0"
    },
    ```

    ### This should now work and deploy the project to sevalla, once done click the visit App.

    **_Note: during deployment, make sure to set the environment variable NODE_ENV to production and add the build script to package.json_**

**_Note: this code is only for production to server both client and server APIs because for development we can spin different servers for frontend and backend_**
