const { createProduct, getAllProducts, getAdminProducts, deleteProduct } = require("../controllers/productController");

const router = require("express").Router();

router.route("/admin/products").get(getAdminProducts);
router.route("/admin/product/new").post(createProduct);
router.route("/products").get(getAllProducts);

router
  .route("/admin/product/:id")
  .delete(deleteProduct);


module.exports = router;
