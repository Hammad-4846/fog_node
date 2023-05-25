const mongoose = require("mongoose");

// Define category schema
const pincodeSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

module.exports = mongoose.model("Pincode", pincodeSchema);
