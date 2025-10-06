# MERN CHATTY

Create a format for a chat app using MERN stack

- create frontend and backend
- create .gitignore file for git ignore
  - add node_modules and .env to the .gitignore file

## Frontend Requirements

- Vanilla React via vite
- TailwindCSS for styling
- Daisy UI for pre-styled classes
- React Router for routing
- Axios for HTTP requests
- Zustand for state management
- Lucide React for icons

### Frontend Setup

**_ Go to `cd frontend`_**

1. React with Vite:

   - `npm create vite@latest .`
   - `npm install`
   - `npm run dev`

2. Adding TailwindCSS

   - Follow docs on [https://tailwindcss.com/docs/installation/using-vite](https://tailwindcss.com/docs/installation/using-vite)
   - `npm install tailwindcss @tailwindcss/vite`
   - add the following to the tailwind.config.js file:

     ```JS
     import tailwindcss from '@tailwindcss/vite'
     export default defineConfig({
     plugins: [
     ...
     tailwindcss(),
     ],
     })
     ```

   - add `@import "tailwindcss";` to the index.css file
   - delete app.css file and other css pre-installed by vite rules

3. Adding Daisy UI for pre-styled classes

   - Follow docs on [https://daisyui.com/docs/install](https://daisyui.com/docs/install)
   - `npm i -D daisyui@latest`
   - add `@plugin "daisyui";` to the index.css file
     **_ Just apply the class such as `btn` to get the pre-styled class _**

4. Adding React Router for routing

   - Follow [https://reactrouter.com/start/declarative/installation](https://reactrouter.com/start/declarative/installation)
   - `npm i react-router`
   - add `<BrowserRouter> to the root of the App component</BrowserRouter>` such as main.jsx

5. Adding Axios for HTTP requests

   - create lib/axios.js file

6. Adding Zustand for state management
   - create lib/store.js file
     - create useAuthStore.js file for authentication, make sure to use cors at the backend

## Backend Requirements

- Node.js
- Express for server
- MongoDB with Mongoose for database
- jsonwebtoken for authentication
- bcryptjs for password hashing
- dotenv for environment variables
  - for latest version of node:>20.6.0, dotenv package may not required, as it is included with node
- cookie-parser for cookies
- nodemailer for sending emails
- cloudinary for image uploading
- arcjet for rate limiting
- cors for cross-origin resource sharing

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

5. Connect to MongoDB

   - `npm install mongoose` which we already did
   - Create an accoune in [https://cloud.mongodb.com/](https://cloud.mongodb.com/) for online mongdb database
   - Create a .env file and add the following:

     - `MONGODB_URL=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority`
     - which you will get after creating the new project in mongodb atlas

   - creating `/backend/src/lib/db.js` file to connect to the database
   - add the connection to the server.js file

#### Implementation Detail on server.js file

1. Add `app.use(express.json())` middleware to parse JSON requests

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

## Backend APIs Implementation Details

### Auth APIs

- `/api/auth/signup` - Register a new user
  - Username, Email and password are required
  - Alert Emails will be sent for new user
- `/api/auth/login` - Login a user
- `/api/auth/logout` - Logout a user

### Profile APIs

- `api/updateProfile` - Update user profile
  - sign up into cloudinary and update profile image
  - install cloudinary `npm install cloudinary` and initialize the cloudinary in /libs/cloudinary.js using its keys
  - Follow the documentation [https://cloudinary.com/documentation/node_integration](https://cloudinary.com/documentation/node_integration)

### Message APIs

- `/api/messages/` - Get all messages

## Rate Limit with Arcjet

- Rate limiting is a way to control how often someone can do something on a website or app.
- Like how many time a user can refresh the page, make a request to an api, or try to login.
- Example: only 100 requests per user every 2 minute.
  **_In simple term, arcjet is a rate limiter_**
  - Archjet prevent abuse (ex. someone making 1000 login attempts in a minute)
  - Protect against DDoS attacks || overwhelming the server with requests
- Status Code: 429

### Arcjet Implementation

- Create an account in [https://arcjet.com/](https://arcjet.com/)
- Copy the API key and add it to the .env file
  - or follow [https://app.arcjet.com/sites/site_01k6apm7tbentttq3sk1mak9rf/sdk-configuration?first-install](https://app.arcjet.com/sites/site_01k6apm7tbentttq3sk1mak9rf/sdk-configuration?first-install)
- install dependencies `npm i @arcjet/node @arcjet/inspect`
- create /libs/arcjet.js file and add the following
  ```JS
  import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node"
  import { ENV } from "../lib/env.js"
  const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: ENV.ARCJET_API_KEY,
  rules: [
  // Shield protects your app from common attacks e.g. SQL injection
  shield({ mode: "LIVE" }),
  // Create a bot detection rule
  detectBot({
  mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
  // Block all bots except the following
  allow: [
  "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
  // Uncomment to allow these other common bot categories
  // See the full list at https://arcjet.com/bot-list
  //"CATEGORY:MONITOR", // Uptime monitoring services
  //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
  ],
  }),
  // Create a token bucket rate limit. Other algorithms are supported.
  slidingWindow({
  mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
  // Tracked by IP address by default, but this can be customized
  // See https://docs.arcjet.com/fingerprints
  //characteristics: ["ip.src"],
  interval: 60, // 60 second sliding window
  max: 5, // allow a maximum of 100 requests
  }),
  ],
  })
  ```
- now create arcjet.middleware.js file in /middleware and add the following

  ```JS
  import aj from "../lib/arcjet.js"
  import { isSpoofedBot } from "@arcjet/inspect"
  export const arcjetProtection = async (req, res, next) => {
  try {
  const decision = await aj.protect(req)

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Please try again later." })
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." })
      } else {
        return res.status(403).json({
          message: "Access denied by security policy.",
        })
      }
    }

    // check for spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      })
    }

    next()

  } catch (error) {
  console.log("Arcjet Protection Error:", error)
  next()
  }
  }
  ```

- now use the middleware in your routes such as `router.use(arcjetProtection)` or `app.use('/routePath', arcjetProtection)`
