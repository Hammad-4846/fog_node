const router = require("express").Router();
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

router.route("/auth/me").get(isAutheticatedUser, getUserDetails);
router.route("/auth/login").post(loginUser);
router.route("/auth/register").post(registerUser);
router.route("/auth/logout").get(logoutController);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


router.route("/admin/users").get(getAllUsers);
router.route("/admin/user/:id").delete(deleteUser);

module.exports = router;
