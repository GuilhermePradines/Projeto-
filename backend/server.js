const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;
const SECRET = "supersecretkey";

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "auth_db",
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Registro
app.post("/register", async (req, res) => {
  const { email, username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
  db.query(query, [email, username, hashedPassword], (err, result) => {
    if (err) return res.status(500).send("Error creating user");
    res.status(201).send("User registered");
  });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err || results.length === 0) return res.status(404).send("User not found");
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Invalid credentials");
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
