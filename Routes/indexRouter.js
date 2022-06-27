const express = require("express");
let Book = require("../models/bookModel");

const indexRouter = express.Router();

indexRouter.get("/", function (req, res) {
  Book.find({}, function (err, books) {
    if (err) {
      console.log(err);
    }
    res.render("index", { books });
  });
});

indexRouter.get("/about", (req, res) => {
  res.render("pages/about");
});

module.exports = indexRouter;
