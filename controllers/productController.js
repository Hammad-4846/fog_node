const Product = require("../models/ProductModal");
const { success, error } = require("../utils/responseWrapper");
const ApiFeatures = require("../utils/apiFeature");
const cloudinary = require("cloudinary");

exports.createProduct = async (req, res) => {
  try {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
    // req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.send(success(200, product));
  } catch (e) {
    res.send(error(500, e.message));
    console.log("Error Occured", e.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();

    let products = await apiFeature.query;

    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);

    res.send(
      success(200, {
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
      })
    );
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

// Get Product Details
exports.getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.send(error(404, "Product Not Found"));
    }

    res.send(success(200, product));
  } catch (e) {
    res.send(error(500, e.message));
  }
};
