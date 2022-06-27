const express = require("express");
const Book = require("../models/bookModel");
const Category = require("../models/categoryModel");

const cartRouter = express.Router();

cartRouter.get("/", (req, res) => {
  //get cart from session
  const cart = req.session.cart;
  const displayCart = { items: [], total: 0 };
  const total = 0;

  //get total
  for (let item in cart) {
    displayCart.items.push(cart[item]);
    total += cart[item].qty * cart[item].price;
  }
  displayCart.total = total;

  //render cart
  res.render("cart/index", { cart: displayCart });
});

cartRouter.route("/:id").post((req, res) => {
  req.session.cart = req.session.cart || {};
  let cart = req.session.cart;

  Book.findOne({ _id: req.params.id }, (error, book) => {
    if (error) {
      console.log(err);
    }
    if (cart[req.params.id]) {
      cart[req.params.id].qty++;
    } else {
      cart[req.params.id] = { 
        item: book._id,
        title: book.title,
        price: book.price,
        qty: 1,
      };
    }
    res.redirect("/cart");
  });
});

module.exports = cartRouter;
