const Product = require("../models/ProductModal");
const { success, error } = require("../utils/responseWrapper");
const ApiFeatures = require("../utils/apiFeature");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      stock,
      price,
      category,
      longDescription,
      images,
      weight,
      discountedPrice,
    } = req.body;
    const product = await Product.create({
      name,
      description,
      stock,
      price,
      category,
      longDescription,
      weight,
      discountedPrice,
      images: {
        public_id: "sample_img",
        url: "https://res.cloudinary.com/dhhlsvxwf/image/upload/v1682651084/categoires/iagyxwq3snaxsdnicprr.jpg",
      },
    });

    await product.save();

    res.send(success(200, product));
  } catch (e) {
    res.send(error(500, e.message));
    console.log("Error Occured", e.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const allProduct = await Product.find();

    res.send(success(200, allProduct));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

//Get All Products (Admin)
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.send(success(200, products));
  } catch (e) {
    res.send(500, e.message);
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    console.log(product);

    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }

    // // Deleting Images From Cloudinary
    // for (let i = 0; i < product.images.length; i++) {
    //   await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    // }

    await Product.deleteOne({ _id: req.params.id });

    res.send(success(200, "Product Delete Successfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};
