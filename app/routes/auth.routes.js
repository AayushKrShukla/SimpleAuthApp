import { verifySignup } from "../middleware/index.js";
import controller from "../controllers/auth.controller.js";

export function sign(app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignup.checkDuplicateUsernameOrEmail,
      verifySignup.checkRolesExisted,
    ],
    controller.signUp
  );

  app.post("/api/auth/signin", controller.signIn);
}
