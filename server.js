import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import { sign } from "./app/routes/auth.routes.js";
import { log } from "./app/routes/user.routes.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

db.sequelize.sync().then(() => {
  console.log("Drop and resync database");
  // initial();
});

function initial() {
  const Role = db.role;

  Role.create({
    id: 1,
    name: "user",
  });
  Role.create({
    id: 2,
    name: "admin",
  });
  Role.create({
    id: 3,
    name: "moderator",
  });
}

sign(app);
log(app);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my website" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running now at prto ${PORT}`);
});
