import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { db } from "./db.mjs";
import passport from "passport";

const app = express();
const PORT = process.env.SERVER_PORT || 3000;
const SECRET = process.env.SECRET || "your_default_secret";

app.use(morgan("dev"));
app.use(bodyParser.json());

const usersDB = [];

app.post("/users/signup", (req, res) => {
  const { username, password } = req.body;

  if (usersDB.some((user) => user.username === username)) {
    return res.status(400).json({ error: "Username already exists." });
  }

  const newUser = { id: usersDB.length + 1, username, password, token: null };
  usersDB.push(newUser);

  res.json({ msg: "Registration successful. You can now log in." });
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.body;

  const user = usersDB.find((u) => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
  user.token = token;

  res.json({ token, id: user.id, username: user.username });
});

app.get("/users/logout", authorize, (req, res) => {
  const userId = req.user.id;

  const userIndex = usersDB.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    usersDB[userIndex].token = null;
  }

  res.json({ msg: "Logout successful." });
});

function authorize(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  })(req, res, next);
}

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});