const User = require("../models/UserModal");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const { error, success } = require("../utils/responseWrapper");

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
    console.log("This is email and pass",email,password);

    if (!email || !password) {
      return res.send(error(401, "Please Enter Valid Email And Password"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.send(error(401, "Invalid Email And Password"));
    }

    const isPasswordMatched = user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.send(error(401, "Invalid Email And Password"));
    }

    sendToken(user, 200, res);
  } catch (e) {
    res.send(error(500, e.message));
  }
};

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

//Get user Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

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
