const jwt = require("jsonwebtoken");
const User = require("../models/UserModal");
const { success, error } = require("../utils/responseWrapper");

exports.isAutheticatedUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.send(error(404, "You Need To Login To access This Resource"));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);


  next();
};
