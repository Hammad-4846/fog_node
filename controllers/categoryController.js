const Category = require("../models/Category");
const { error, success } = require("../utils/responseWrapper");

exports.createCategory = async (req, res) => {
  try {
    const { description, name, keyword, title, image } = req.body;

    const category = await Category.create({
      description,
      name,
      keyword,
      title,
      image,
    });
    await category.save();
    res.send(success(200, category));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

exports.createSubCategory = async (req, res) => {
  try {
    const { description, keyword, title, name, categoryName } = req.body;
    const category = await Category.findOne({ name: categoryName });
    const SubCategory = {
      name: name,
      description,
      keyword,
      title,
    };
    if (!category) {
      return res.send(
        error(
          404,
          `${categoryName} Category Not Found !! Please Check The spelling || Make sure it is present in your category Section`
        )
      );
    }
    category.subcategories.push(SubCategory);
    await category.save();
    res.send(success(200, category));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();
    return res.send(success(200, allCategories));
  } catch (e) {
    res.send(error(500, e.message));
  }
};
