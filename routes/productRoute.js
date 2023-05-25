const {
  createProduct,
  getAllProducts,
  getAdminProducts,
  deleteProduct,
  getProductDetails,
  updateProduct,
} = require("../controllers/productController");

const router = require("express").Router();

router.route("/admin/products").get(getAdminProducts);
router.route("/admin/product/new").post(createProduct);
router.route("/products").get(getAllProducts);
router.get("/product/:id", getProductDetails);

router.route("/admin/product/:id").delete(deleteProduct).put(updateProduct);

module.exports = router;
