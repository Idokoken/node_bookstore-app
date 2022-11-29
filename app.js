const express = require("express");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const chalk = require("chalk");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const authRouter = require("./Routes/authRouter");
const indexRouter = require("./Routes/indexRouter");
const bookRouter = require("./Routes/bookRouter");
const categoryRouter = require("./Routes/categoryRouter");
const cartRouter = require("./Routes/cartRouter");

require("dotenv").config();

//app setup
const app = express();
const port = process.env.PORT;
app.use(expressLayouts);

//view setups
app.set("view engine", "ejs");
app.set("Views", "Views");
app.set("layout", "layouts/layout");

//database setup
//mongodb://localhost/Cipistore
mongoose.connect("mongodb://localhost/Cipistore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", () => console.log("error connecting to cipiStore database"));
db.once("open", () =>
  console.log(
    `successfully connected to ${chalk.magenta("cipiStore database")}`
  )
);

//middleware setups
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(cookieParser());
app.use(
  session({ secret: "bookStore", resave: true, saveUninitialized: true })
);
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
global.moment = require("moment");

//route setups
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/cart", cartRouter);

app.listen(port, () => console.log("listening on port " + chalk.magenta(8000)));
