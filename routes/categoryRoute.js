const { createCategory, createSubCategory, getAllCategories } = require("../controllers/categoryController");

const router = require("express").Router();


router.route("/add-cat").post(createCategory);
router.route("/add-sub-cat").post(createSubCategory);
router.route("/categories").get(getAllCategories);

module.exports = router;
