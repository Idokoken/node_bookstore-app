const express = require("express");
const Book = require("../models/bookModel");
const Category = require("../models/categoryModel");

const cartRouter = express.Router();

// cartRouter.get("/", (req, res) => {
//   //cart items
//   let cookieValue = req.cookies;
//   let cookieArray;
//   if (cookieValue.cart) {
//     cookieArray = JSON.parse(cookieValue.cart);
//   } else {
//     cookieArray = [];
//   }
//   //get cart from session
//   const cart = req.session.cart;
//   const displayCart = { items: [], total: 0 };
//   const total = 0;

//   //get total
//   for (let item in cart) {
//     displayCart.items.push(cart[item]);
//     total += cart[item].qty * cart[item].price;
//   }
//   displayCart.total = total;

//   //render cart
//   res.render("cart/index", { cart: displayCart, cartNumb: cookieArray.length });
// });

// cartRouter.route("/:id").post((req, res) => {
//   req.session.cart = req.session.cart || {};
//   let cart = req.session.cart;

//   Book.findOne({ _id: req.params.id }, (error, book) => {
//     if (error) {
//       console.log(err);
//     }
//     if (cart[req.params.id]) {
//       cart[req.params.id].qty++;
//     } else {
//       cart[req.params.id] = {
//         item: book._id,
//         title: book.title,
//         price: book.price,
//         qty: 1,
//       };
//     }
//     res.redirect("/cart");
//   });
// });

cartRouter.get("/", (req, res) => {
  const cookieValue = req.cookies;
  let cookieArray;
  let cartTotal;
  let tempcartArray;

  if (cookieValue.cart) {
    cookieArray = JSON.parse(cookieValue.cart);
    //cookieArray = cookieValue.cart;
    cookieArray.sort();
    // console.log(cookieArray);
    tempcartArray = [];
    for (let i = 0; i < cookieArray.length; i++) {
      for (let j = 0; j < Data.length; j++) {
        if (cookieArray[i] == Data[j].id) {
          tempcartArray.push(Data[i]);
        }
      }
    }
    cartTotal = 0;
    for (let i = 0; i < tempcartArray.length; i++) {
      cartTotal = cartTotal + tempcartArray[i].price;
      //cartTotal += tempcartArray[i].price
    }
  } else {
    cartTotal = 0;
    tempcartArray = [];
    cookieArray = [];
    //console.log("cart empty");
  }
  //res.status(200).json({ msg: "cart page" });
  // console.log(cookieArray.length);
  // console.log(tempcartArray);
  // console.log(cartTotal);
  res.render("cart", {
    cart: cookieValue.cart,
    cartNumb: cookieArray.length,
    cartValues: tempcartArray,
    total: cartTotal,
  });
});

cartRouter.get("/remove/:id", (req, res) => {
  let cookiesValue = req.cookies;
  let cookiesArray = JSON.parse(cookiesValue.cart);
  let { id } = req.params;

  for (let i = 0; i < cookiesArray.length; i++) {
    if (id == cookiesArray[i]) {
      cookiesArray.splice(i, 1);
      break;
    }
  }
  let stringArray = JSON.stringify(cookiesArray);
  res.clearCookie("cart");
  res.cookie("cart", stringArray);
  res.redirect("/cart");
});

// paypay
cartRouter.post("/chargepaypal", (req, res) => {
  let items = req.body.description;
  items = JSON.parse(items);

  let chargeAmount = 5;
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < Data.length; j++) {
      if (items[i] == Data[j].id) {
        chargeAmount += Data[j].price;
      }
    }
  }

  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://localhost:8080/success?price=${chargeAmount}&description=${items}`,
      cancel_url: "http://localhost:8080/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "ecommerce sale",
              sku: `${items}`,
              price: `${chargeAmount}`,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: `${chargeAmount}`,
        },
        description: "Sale of colors",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      res.send("an error has occured");
      throw error;
    } else {
      let link = payment.link;
      for (let i = 0; i < link.length; i++) {
        if (payment.links[i].rel == "approved_url")
          res.redirect(payment.links[i].href);
      }
      //console.log("Create Payment Response");
      //console.log(payment);
    }
  });
});

//success
cartRouter.get("/success", (req, res) => {
  const { payerID, paymentID } = req.query;
  let chargeAmount = req.query.price;
  let items = req.query.description;

  let execute_payment_json = {
    payer_id: payerID,
    transactions: [
      {
        amount: { currency: "USD", total: `${chargeAmount}` },
      },
    ],
  };
  paypal.payment.execute(
    paymentID,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        res.send("an error has occured");
        throw error;
      } else {
        let shippingEmail = payment.payer.payer_info.email;
        let shippingName =
          payment.payer.payer_info.shipping_address.recipient.name;
        let shippingAddress =
          payment.payer.payer_info.shipping_address.line1 +
          " " +
          payment.payer.payer_info.shipping_address.line2;
        let shippingZIP = payment.payer.payer_info.shipping_address.postal_code;
        let shippingState = payment.payer.payer_info.shipping_address.state;
        let shippingCity = payment.payer.payer_info.shipping_address.city;
        let shippingCountry = payment.payer.payer_info - address.country_code;
        let Type = "Paypal";

        newOrderEntry = new OrderEntry({
          name: shippingName,
          email: shippingEmail,
          address: shippngAddress,
          zip: shippingZIP,
          state: shippingState,
          city: shippingCity,
          country: shippingCountry,
          description: items,
          grossTotal: chargeAmount,
          type: Type,
        });

        newOrderEntry.save();
        res.clearCookie("cart");
        res.redirect("/submission/payment_successful");
      }
    }
  );
});

module.exports = cartRouter;
