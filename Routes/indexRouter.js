const express = require("express");
let Book = require("../models/bookModel");

const indexRouter = express.Router();

indexRouter.get("/home", function (req, res) {
  Book.find({}, function (err, books) {
    if (err) {
      console.log(err);
    }
    res.render("index", { books });
    console.log("home")
  }); 
});

indexRouter.get("/about", (req, res) => {
  console.log('about')
  res.render("pages/about");
});

module.exports = indexRouter;