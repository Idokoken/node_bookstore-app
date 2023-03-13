const express = require("express");
const Books = require("../models/bookModel");
const Category = require("../models/categoryModel");
const { upload } = require("../config/upload.cloudnary");
const { uploadOptions } = require("../config/upload.diskStorage");
const Data = require("../config/data");

const bookRouter = express.Router();

//get all books for books page
bookRouter.get("/", async (req, res) => {
  //cart items
  let cookieValue = req.cookies;
  let cookieArray;
  if (cookieValue.cart) {
    cookieArray = JSON.parse(cookieValue.cart);
  } else {
    cookieArray = [];
  }
  try {
    let books = await Books.find();
    res.render("pages/books", { books: Data, cartNumb: cookieArray.length });
    console.log("books");
  } catch (err) {
    res.status(500).json(err);
  }
});

//create book
bookRouter
  .route("/create")
  .get(async (req, res) => {
    //cart items
    let cookieValue = req.cookies;
    let cookieArray;
    if (cookieValue.cart) {
      cookieArray = JSON.parse(cookieValue.cart);
    } else {
      cookieArray = [];
    }
    try {
      const category = await Category.find();
      res.render("admin/book/add", { category, cartNumb: cookieArray.length });
    } catch (error) {
      res.status(500).json(error);
    }
  })
  .post(uploadOptions.single("cover"), async (req, res) => {
    const {
      title,
      author,
      publisher,
      price,
      category,
      description,
      countInStock,
      rating,
      numOfReviews,
      isFeatured,
    } = req.body;

    // for file upload
    const fileName = req.file.filename;
    //http://localhost:8000/public/uploads/image-4573.png
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const cover = `${basePath}${fileName}`;

    if (!title || !description || !cover || !price || !category) {
      req.flash("error", "All compulsory fields are required");
      res.render("admin/book/add");
      // res.send("all compulsory fields are required");
    }

    try {
      const newBook = new Books({
        title,
        author,
        publisher,
        price,
        category,
        description,
        cover,
        countInStock,
        rating,
        numOfReviews,
        isFeatured,
      });
      const books = await newBook.save();
      req.flash("info", "book successfully created");
      res.redirect("/admin");
      res.status(200).json(books);
    } catch (err) {
      req.flash("error", "error creating books");
      res.redirect("/books/create");
      // res.status(500).json(err);
    }
  });

//get single book
bookRouter.get("/:id", async (req, res) => {
  //cart items
  let cookieValue = req.cookies;
  let cookieArray;
  if (cookieValue.cart) {
    cookieArray = JSON.parse(cookieValue.cart);
  } else {
    cookieArray = [];
  }

  const { id } = req.params;
  try {
    const data = Data.filter((book, i) => book._id == id).map((a) =>
      res.render("pages/singlebook", { book: a, cartNumb: cookieArray.length })
    );
    // console.log(data);
    //const book = await Books.findById(req.params.id);
    //res.render("pages/singlebook", { book: data, cartNumb: cookieArray.length  });
  } catch (err) {
    res.status(500).json(err);
  }
});

//update call
bookRouter
  .route("/update/:id")
  .get(async (req, res) => {
    //cart items
    let cookieValue = req.cookies;
    let cookieArray;
    if (cookieValue.cart) {
      cookieArray = JSON.parse(cookieValue.cart);
    } else {
      cookieArray = [];
    }

    try {
      const category = await Category.find();
      const book = await Books.findById(req.params.id);
      res.render("manage/book/edit", {
        book,
        category,
        cartNumb: cookieArray.length,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  })
  .post(upload.single("cover"), async (req, res) => {
    const { title, publisher, price, description, author, categories } =
      req.body;
    try {
      if (!title || !description || !req.file) {
        req.flash("error", "All compulsory fields are required");
        res.redirect(`books/update/${req.params.id}`);
      }
      const cover = req.file.path;
      //console.log({ title, description, author, category, cover });
      await Books.findByIdAndUpdate(
        req.params.id,
        { title, publisher, price, description, author, categories, cover },
        { new: true }
      );
      req.flash("info", "category successfully updated");
      res.redirect("/admin");
    } catch (error) {
      res.status(500).json(error);
      //res.redirect("/category/create");
    }
  });

//delete call
bookRouter.get("/delete/:id", async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);
    await book.delete();
    req.flash("info", "book successfully deleted");
    res.redirect("/admin");
  } catch (err) {
    //res.status(500).json(err);
    res.redirect("/admin");
  }
});

module.exports = bookRouter;
