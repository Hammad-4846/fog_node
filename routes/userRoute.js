const router = require("express").Router();
const { loginUser, registerUser } = require("../controllers/userController");

router.route("/auth/login").post(loginUser);
router.route("/auth/register").post(registerUser);

module.exports = router;
