const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const port = 3000;
const product = require("./routes/product");
const config = require("config");
const settings = {};
if (config.util.getEnv("NODE_ENV") !== "test") {
  app.use(morgan("combined"));
}
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
mongoose.connect(config.DBHost, settings);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
app.route("/product").get(product.getAllProduct).post(product.postProduct);
app
  .route("/product/:id")
  .get(product.getProduct)
  .delete(product.deleteProduct)
  .put(product.updateProduct);
app.route("/search/:key").get(product.searchProduct);
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the ProductMart" });
});

app.listen(port);
module.exports = app;
