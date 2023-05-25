const Category = require("../models/Category");
const cloudinary = require("cloudinary").v2;
const { error, success } = require("../utils/responseWrapper");

exports.createCategory = async (req, res) => {
  try {
    const { name, categoryIMG } = req.body;
    const respImg = await cloudinary.uploader.upload(categoryIMG, {
      folder: "categories",
    });
    const category = await Category.create({
      name,
      image: {
        url: respImg.secure_url,
        public_id: respImg.public_id,
      },
    });
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

// Delete Categories
exports.deleteCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    console.log(category);

    if (!category) {
      return res.send(error(404, "category not found"));
    }

    // Deleting Images From Cloudinary
    await cloudinary.uploader.destroy(category.image.public_id);

    await Category.deleteOne({ _id: req.params.id });

    res.send(success(200, "category Delete Successfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//Get Category Detail
exports.getCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const catergory = await Category.findById({ _id: id });
    if (!catergory) {
      return res.send(error(404, "Not Found"));
    }

    res.send(success(200, catergory));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};
