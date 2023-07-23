const User = require("../models/UserModal");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const { error, success } = require("../utils/responseWrapper");
const { sendEmail } = require("../utils/sendMail");
const crypto = require("crypto");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "DEmo img",
      url: "DEmo img",
    },
  });

  sendToken(user, 201, res);
});

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send(error(401, "Please Enter Valid Email And Password"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.send(error(401, "Invalid Email And Password"));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.send(error(401, "Invalid Email And Password"));
    }

    sendToken(user, 200, res);
  } catch (e) {
    res.send(error(500, e.message));
  }
};

exports.logoutController = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });

    return res.send(success(200, "Logged out successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

//Get user Detail
exports.getUserDetails = async (req, res) => {
  res.send(success(200, req.user));
};

//Update user Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is Incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password Don't Matched", 400));
  }

  user.password = newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//Update user Details
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //In Future we will add cloudinary for avatar
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "User Data is Succesfully Updated",
  });
});

//Admin Controller
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.send(success(200, allUsers));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//Delete Product
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send(success(200, "User Is Delete Succesfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send(error(404, "User not found"));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;

    const message = `${resetPasswordUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: `GlutenFree Password Recovery`,
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (e) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.send(error(500, e.message));
    }
  } catch (e) {
    res.send(error(500, e.message));
  }
};

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.send(
      error(400, "Reset Password Token is invalid or has been expired")
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send(error(400, "Password does not password"));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});
