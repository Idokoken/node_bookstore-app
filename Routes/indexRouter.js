const express = require("express");
const Books = require("../models/bookModel");
const Category = require("../models/categoryModel");
const Contact = require("../models/contactModel");

const indexRouter = express.Router();

//home Page
indexRouter.get("/", async (req, res) => {
  try {
    const books = await Books.find();
    res.render("pages/home", { books });
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin home page
indexRouter.get("/admin", async (req, res) => {
  try {
    const category = await Category.find();
    const books = await Books.find();
    res.render("manage/index", { books, category });
  } catch (error) {
    res.status(500).json(error);
  }
});

//About page
indexRouter.get("/about", (req, res) => {
  res.render("pages/about");
});

// contact page
indexRouter
  .route("/contact")
  .get((req, res) => {
    let cookieValue = req.cookies;
    let cookieArray;
    if (cookieValue.cart) {
      cookieArray = JSON.parse(cookieValue.cart);
    } else {
      cookieArray = [];
    }
    res.render("pages/contact", { cartNum: cookieArray.length });
  })
  .post(async (req, res) => {
    //const { name, email, subject, comment } = req.body;

    try {
      const newContact = await new Contact(req.body);
      const Contact = await newContact.save();
      console.log(newContact);
      res.redirect("/contact");
    } catch (error) {
      res.status(500).json(error);
    }
  });

module.exports = indexRouter;
