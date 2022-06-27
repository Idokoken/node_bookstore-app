const express = require("express");
const Book = require("../models/bookModel");
const Category = require("../models/categoryModel");

const manageRouter = express.Router();

manageRouter.get("/", (req, res) => {
  res.render("manage/index", { layout: "manage" });
});

manageRouter.get("/books", (req, res) => {
  Book.find({}, function (err, books) {
    if (err) {
      console.log(err);
    }
    res.render("manage/book/index", { layout: "manage", books });
  });
});

manageRouter.get("/books/add", (req, res) => {
  Category.find({}, function (err, categories) {
    if (err) {
      console.log(err);
    }
    res.render("manage/book/add", { layout: "manage", categories });
  });
});

manageRouter.post("/books", (req, res) => {
  const { title, author, publisher, price, description, cover, category } =
    req.body;

  if (title == "" || price == "") {
    req.flash("error", "please fill in the required fields");
    res.location("/manage/books/add");
    res.redirect("/manage/books/add");
  }
  if (isNaN(price)) {
    req.flash("error", "price must be a number");
    res.location("/manage/books/add");
    res.redirect("/manage/books/add");
  }

  const newBook = new Book({
    title,
    author,
    publisher,
    price,
    category,
    description,
    cover,
  });
  newBook.save((err) => {
    if (err) {
      console.log("error saved", err);
    }
    req.flash("success", "added successefully");
    res.location("/manage/books");
    res.redirect("/manage/books");
  });
});

manageRouter.get("/books/edit/:id", (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    Category.find({}, function (err, categories) {
      if (err) {
        console.log(err);
      }
      res.render("manage/book/edit", { layout: "manage", categories, book });
    });
  });
});

manageRouter.post("/books/edit/:id", (req, res) => {
  const { title, author, publisher, price, description, cover, category } =
    req.body;

  if (title == "" || price == "") {
    req.flash("error", "please fill in the required fields");
    res.location("/manage/books/add");
    res.redirect("/manage/books/add");
  }
  if (isNaN(price)) {
    req.flash("error", "price must be a number");
    res.location("/manage/books/add");
    res.redirect("/manage/books/add");
  }

  Book.update(
    { _id: req.params.id },
    {
      title,
      author,
      publisher,
      price,
      category,
      description,
      cover,
    },
    (err) => {
      if (err) {
        console.log("error saved", err);
      }
      req.flash("success", "added successfully");
      res.location("/manage/books");
      res.redirect("/manage/books");
    }
  );
});

manageRouter.post("/books/delete/:id", (req, res) => {
  Book.remove({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(err);
    }
    req.flash("success", "successfully deleted");
    res.location("/manage/books");
    res.redirect("/manage/books");
  });
});

//categories
manageRouter.get("/categories", (req, res) => {
  Category.find({}, (err, categories) => {
    if (err) {
      console.log(err);
    }
    res.render("manage/categories/index", { layout: "manage", categories });
  });
});

manageRouter.post("/categories", (req, res) => {
  const { name } = req.body;
  if (name == "") {
    req.flash("success", "category successfully created");
    res.location("/manage/categories/add");
    res.redirect("/manage/categories/add");
  }
  const category = new Category({
    name,
  });
  category.save((err) => {
    if (err) {
      console.log(err);
    }
    req.flash("success", "category successfully created");
    res.location("/manage/categories");
    res.redirect("/manage/categories");
  });
});

manageRouter.get("/categories/add", (req, res) => {
  res.render("manage/categories/add", { layout: "manage" });
});

manageRouter.get("/categories/edit/:id", (req, res) => {
  Category.findById(req.params.id, (err, category) => {
    if (err) {
      console.log(err);
    }
    res.render("manage/categories/edit", { layout: "manage", category });
  });
});

manageRouter.post("/categories/edit/:id", (req, res) => {
  const { name } = req.body;
  if (name == "") {
    req.flash("success", "category successfully created");
    res.location("/manage/categories/add");
    res.redirect("/manage/categories/add");
  }

  Category.update(req.params.id, { name }, (err) => {
    if (err) {
      console.log(err);
    }
    req.flash("success", "category successfully updated");
    res.location("/manage/categories");
    res.redirect("/manage/categories");
  });
});

manageRouter.post("/categories/delete/:id", (req, res) => {
  Category.remove({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(err);
    }
    req.flash("success", "category successfully updated");
    res.location("/manage/categories");
    res.redirect("/manage/categories");
  });
});

module.exports = manageRouter;
