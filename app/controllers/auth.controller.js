import db from "../models/index.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const signUp = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcryptjs.hashSync(req.body.password, 8),
    });
    console.log("here");
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: { name: { [Op.or]: req.body.roles } },
      });
      console.log("what");
      await user.setRoles(roles);
      return res.send({ message: "User was registered successfully!" });
    }
    await user.setRoles([1]);
    return res.send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcryptjs.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Credentials!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    var authorities = [];
    const roles = await user.getRoles();
    roles.forEach((el) => {
      authorities.push("ROLE_" + el.name.toUpperCase());
    });
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export default {
  signUp,
  signIn,
};
