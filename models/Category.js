const mongoose = require("mongoose");

// Define category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },

  keyword: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  image: {
    public_id: String,
    url: String,
  },

  subcategories: {
    type: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        keyword: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          required: true,
        },
      },
    ],
    validate: {
      validator: function (subcategories) {
        const subcategoryNames = subcategories.map(
          (subcategory) => subcategory.name
        );
        return new Set(subcategoryNames).size === subcategoryNames.length; // Check if all subcategory names are unique
      },
      message: (props) => "Subcategory names must be unique",
    },
  },
});

module.exports = mongoose.model("Category", categorySchema);
