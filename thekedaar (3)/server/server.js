
// install:
// npm install express cors jsonwebtoken bcrypt

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "change_this_secret_in_env";
const NEON_DB_URL = "https://ep-cold-brook-aevce60i.apirest.c-2.us-east-2.aws.neon.tech/neondb/rest/v1";

// Dummy user (example). Real app me DB use karoge.
const user = {
  id: 1,
  email: "test@example.com",
  // "password123" ka hashed version:
  passwordHash: "$2b$10$h2Zl...." // yahan real bcrypt hash daalo
};

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email & password required" });
  }

  if (email !== user.email) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, email: user.email }
  });
});

// Note: This server code cannot run directly in the browser environment.
// The frontend App.tsx has been updated to simulate this persistence.
// To run this: node server/server.js
app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});
