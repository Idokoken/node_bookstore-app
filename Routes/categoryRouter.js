const express = require("express");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");

const categoryRouter = express.Router();

categoryRouter
  .route("/create")
  .get((req, res) => {
    res.render("admin/category/add");
  })
  .post(async (req, res) => {
    const { name, icon } = req.body;
    const newCategory = new Category({ name, icon });
    try {
      const category = await newCategory.save();
      req.flash("info", "book category successfully created");
      res.redirect("/admin");
    } catch (err) {
      //res.status(500).json(err);
      res.redirect("/category/create");
    }
  });

// edit category
categoryRouter
  .route("/edit/:id")
  .get(async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.render("admin/category/edit", { category });
    } catch (error) {
      res.status(500).json(error);
    }
  })
  .post(async (req, res) => {
    const { id } = req.params.id;
    const { name, icon } = req.body;
    try {
      await Category.findByIdAndUpdate(id, { name, icon }, { new: true });
      req.flash("info", "book category successfully updated");
      res.redirect("/admin");
    } catch (error) {
      req.flash("error", "error updating book category");
      res.redirect("/category/edit/" + id);
    }
  });

// delete category
categoryRouter.get("/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash("info", "category successfully deleted");
    res.redirect("/admin");
  } catch (error) {
    res.redirect("/admin");
  }
});

module.exports = categoryRouter;
