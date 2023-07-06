const router = require("express").Router();
const passport = require("passport");
const {
  loginUser,
  registerUser,
  getAllUsers,
  deleteUser,
  getUserDetails,
  logoutController,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { isAutheticatedUser } = require("../middlewares/isAuthenticated");
const CreatePassport = require("../utils/Provider");
const sendToken = require("../utils/jwtToken");

router.route("/auth/me").get(isAutheticatedUser, getUserDetails);
router.route("/auth/login").post(loginUser);
router.route("/auth/register").post(registerUser);
router.route("/auth/logout").get(logoutController);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

// Routes for Google authentication
router.get(
  "/auth/google",
  (req, res, next) => {
    CreatePassport(req, res);
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureRedirect: "/auth", // Redirect to the login page on authentication failure
    successRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    // Redirect to the appropriate page after successful authentication
    const { user, token } = req.user;

    // You can now access and use the user and token data in the route handler
    // For example, you can send it as a response or perform additional operations
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie("token", token, options);

    res.json({ user });
  }
);

router.route("/admin/users").get(getAllUsers);
router.route("/admin/user/:id").delete(deleteUser);

module.exports = router;
