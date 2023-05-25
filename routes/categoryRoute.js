const {
  createCategory,
  getAllCategories,
  deleteCategories,
  getCategoryDetail,
} = require("../controllers/categoryController");

const router = require("express").Router();

router.route("/add-cat").post(createCategory);
router.route("/categories").get(getAllCategories);
router.route("/category/:id").delete(deleteCategories).get(getCategoryDetail);

module.exports = router;
