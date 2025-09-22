import "dotenv/config"

export const ENV = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL:
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_URL
      : "http://localhost:3000",

  SENDER_EMAIL: process.env.SENDER_EMAIL,
  SENDER_PASSWORD: process.env.SENDER_PASSWORD,
}

if (!ENV.MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables")
  process.exit(1)
}

if (!ENV.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables")
  process.exit(1)
}

if (!ENV.SENDER_EMAIL || !ENV.SENDER_PASSWORD) {
  console.error("Email credentials are not defined in environment variables")
  process.exit(1)
}

export default ENV
