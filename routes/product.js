const mongoose = require("mongoose");
const Product = require("../models/product");

function getAllProduct(req, res) {
  let query = Product.find({});
  query.exec((err, products) => {
    if (err) res.send(err);
    res.json(products);
  });
}

function postProduct(req, res) {
  let newProduct = new Product(req.body);
  newProduct.save((err, product) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      res.json({
        message: "Product successfully added",
        product,
      });
    }
  });
}

function getProduct(req, res) {
  Product.findById(req.params.id, (err, product) => {
    if (err) res.send(err);
    res.json(product);
  });
}

function deleteProduct(req, res) {
  Product.remove({ _id: req.params.id }, (err, result) => {
    if (err) res.send(err);
    res.json({ message: "Product deleted successfully", result });
  });
}

function updateProduct(req, res) {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      res.send(err);
    }
    Object.assign(product, req.body).save((err, product) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Product updated succesfully", product });
    });
  });
}

function searchProduct(req, res) {
  let result = Product.find({
    $or: [
      {
        version: { $regex: req.params.key },
      },
    ],
  });
  result.exec((err, products) => {
    if (err) {
      res.send(err);
    }
    res.json(products);
  });
}

module.exports = {
  getAllProduct,
  postProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  searchProduct,
};
