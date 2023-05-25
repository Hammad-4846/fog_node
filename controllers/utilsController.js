const Pincode = require("../models/Pincode");
const { success, error } = require("../utils/responseWrapper");
const Headers = require("../models/Headers");

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
