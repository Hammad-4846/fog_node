const Pincode = require("../models/Pincode");
const { success, error } = require("../utils/responseWrapper");
const Headers = require("../models/Headers");
const Coupons = require("../models/Coupons");
const { sendEmailMessage } = require("../utils/sendMail");

//Pincode Controller
exports.createPincode = async (req, res) => {
  try {
    const { pincode } = req.body;
    const createPincode = await Pincode.create({
      pincode,
    });
    res.send(success(201, createPincode));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//GEt Pincode Controller
exports.getAllPincodes = async (req, res) => {
  try {
    const pincodes = await Pincode.find();
    res.send(success(200, pincodes));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

exports.createAndUpdateHeader = async (req, res) => {
  try {
    const { HeadLine } = req.body;
    const Header = await Headers.find();
    let updateHeader, createHeader;
    if (Header.length > 0) {
      updateHeader = await Headers.findByIdAndUpdate(Header[0]._id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    } else {
      createHeader = await Headers.create({ Headline: HeadLine });
    }
    const finalHeader = updateHeader ? updateHeader : createHeader;
    return res.send(success(201, finalHeader));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

exports.getHeaderLine = async (req, res) => {
  try {
    const Header = await Headers.find();
    res.send(success(200, Header[0].Headline));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//Coupon Controller
exports.createCoupon = async (req, res) => {
  try {
    const { couponNumber, discount } = req.body;
    console.log(couponNumber, discount);
    const createCoupon = await Coupons.create({
      couponNumber,
      discount,
    });
    res.send(success(201, createCoupon));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//GEt Coupons Controller
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupons.find();
    console.log(coupons);
    res.send(success(200, coupons));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

exports.sendContactInformation = async (req, res) => {
  try {
    const { message, name, email } = req.body;

    try {
      await sendEmailMessage({
        email: "agrawalanushka512@gmail.com",
        subject: `Message from ${name}`,
        message: `${message}`,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (e) {
      return res.send(error(500, e.message));
    }
  } catch (e) {
    return res.send(error(5000, e.message));
  }
};
