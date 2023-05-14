const { createProduct, getAllProducts } = require("../controllers/productController");

const router = require("express").Router();

router.route("/admin/product/new").post(createProduct);
router.route("/products").get(getAllProducts);

module.exports = router;
