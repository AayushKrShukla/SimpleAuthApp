import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";

const User = db.user;
const { verify, sign } = jwt;

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.send(401).send({
        message: "Unauthorized",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId, {
    include: [{ model: db.role }],
  });
  if (user.roles.some((el) => el.name === "admin")) {
    next();
    return;
  }
  res.status(403).send({
    message: "Require Admin Role!",
  });
  return;
};

const isMod = async (req, res, next) => {
  const user = await User.findByPk(req.userId, {
    include: [{ model: db.role }],
  });
  if (user.roles.some((el) => el.name === "moderator")) {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Mod Role!",
  });
  return;
};

const isModOrAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId, {
    include: [{ model: db.role }],
  });
  if (user.roles.some((el) => el.name === "admin" || el.name === "moderator")) {
    next();
    return;
  }
};

export default {
  verifyToken,
  isAdmin,
  isMod,
  isModOrAdmin,
};
