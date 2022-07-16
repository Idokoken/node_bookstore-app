const express = require("express");
const Book = require("../models/bookModel");
const Category = require("../models/categoryModel");

const bookRouter = express.Router();

bookRouter.get("/", (req, res) => {
  res.render("index");
});

bookRouter.get("/details/:id", (req, res) => {
  Book.findOne({ _id: req.params.id }, (err, book) => {
    if (err) {
      console.log(err);
    }
    res.render("books/details", { book });
  });
});

module.exports = bookRouter;
