const mongoose = require("mongoose");

// Define category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  image: {
    public_id: String,
    url: String,
  },
});

module.exports = mongoose.model("Category", categorySchema);
