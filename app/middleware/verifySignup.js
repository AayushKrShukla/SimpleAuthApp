import db from "../models/index.js";
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  //Find By Username
  let user;
  user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (user) {
    res.status(400).send({ message: "Failed! Username already exists" });
    return;
  }

  //Check for email also
  user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    res.status(400).send({ message: "Failed! Email already exists" });
    return;
  }

  next();
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }
  next();
};

const verifySignup = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};

export default verifySignup;
