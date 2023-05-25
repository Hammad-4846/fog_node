const {
  createPincode,
  getAllPincodes,
  createAndUpdateHeader,
  getHeaderLine
} = require("../controllers/utilsController");

const router = require("express").Router();

router.route("/util/pincode/create").post(createPincode);
router.route("/util/pincodes").get(getAllPincodes);
router.route("/util/header").post(createAndUpdateHeader);
router.route("/util/header").get(getHeaderLine);

module.exports = router;
