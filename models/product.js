const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    version: { type: String, required: true },
    yearMade: { type: Number, required: true },
    countryMade: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("product", ProductSchema);
