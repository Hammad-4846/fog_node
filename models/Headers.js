const mongoose = require("mongoose");

// Define category schema
const HeaderSchema = new mongoose.Schema({
  Headline: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Header", HeaderSchema);
