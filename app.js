require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const url = require("url");
const querystring = require("querystring");
const { count } = require("console");

const app = express();

app.use(flash());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Oue little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/mini", function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});
const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  password: String,
  googleId: String,
  username: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      //    console.log(profile);
      User.findOrCreate(
        {
          googleId: profile.id,
          name: profile.displayName,
          username: profile.emails[0].value,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

// const itemsSchema = new mongoose.Schema({
//     name: String,
//   });

//   const Item = mongoose.model("Item", itemsSchema);

const subscribeSchema = new mongoose.Schema({
  email: String,
});

const Subscribe = mongoose.model("Subsribe", subscribeSchema);

const trendingSchema = new mongoose.Schema({
  _id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
});

const Trending = mongoose.model("Trending", trendingSchema);

const bestSchema = new mongoose.Schema({
  _id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
});

const Best = mongoose.model("Best", bestSchema);

const allSchema = new mongoose.Schema({
  _id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
});

const All = mongoose.model("All", allSchema);

const menSchema = new mongoose.Schema({
  _id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
});

const Men = mongoose.model("Men", menSchema);

const womenSchema = new mongoose.Schema({
  _id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
});

const Women = mongoose.model("Women", womenSchema);

const kidSchema = new mongoose.Schema({
  _id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
});

const Kid = mongoose.model("Kid", kidSchema);

const mobileSchema = new mongoose.Schema({
  _id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
});

const Mobile = mongoose.model("Mobile", mobileSchema);

const computerSchema = new mongoose.Schema({
  _id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
});

const Computer = mongoose.model("Computer", computerSchema);

const bagSchema = new mongoose.Schema({
  _id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
});

const Bag = mongoose.model("Bag", bagSchema);

const cartSchema = new mongoose.Schema({
  product_id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
  username: String,
});

const Cart = mongoose.model("Cart", cartSchema);

const deletedorderSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  usermsg: String,
  deleteItemId: String,
});

const Deletedorder = mongoose.model("Deletedorder", deletedorderSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  emai: String,
  mobile: String,
  sub: String,
  msg: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const wishlistSchema = new mongoose.Schema({
  product_id: String,
  mainCat: String,
  subCat: String,
  subCatType: String,
  name: String,
  path: String,
  color: String,
  price: Number,
  username: String,
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

const orderSchema = new mongoose.Schema({
  name: String,
  username: String,
  address: String,
  mobile: String,
  orderedProducts: String,
  orderedProductsid: String,
  orderedProductspath: String,
  subTotal: String,
  shipping: String,
  total: String,
  usermsg: String,
  orderedDate: String,
  deliveryDate: String,
});

const Order = mongoose.model("Order", orderSchema);

app.get("/", function (req, res) {
  Trending.find(function (err, items) {
    Best.find(function (err, bestitem) {
      // console.log(bestitem);
      res.render("home", {
        bestitem: bestitem,
        trendingItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        contact: req.flash("contact"),
      });
    });
  });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.cookie("username", req.user.username);
    res.cookie("name", req.user.name);
    res.redirect("/");
  }
);

// Post Requests

app.post("/cart", function (req, res) {
  Trending.find(function (err, items) {
    Best.find(function (err, bestitem) {
      if (req.cookies["username"] != undefined) {
        const product_id = req.body._id;
        const mainCat = req.body.mainCat;
        const subCat = req.body.subCat;
        const subCatType = req.body.subCatType;
        const name = req.body.name;
        const path = req.body.path;
        const color = req.body.color;
        const price = req.body.price;
        const username = req.cookies["username"];

        // console.log(_id,mainCat,subCat,subCatType,name,path,color,price,username,userId);

        const product = new Cart({
          product_id: product_id,
          mainCat: mainCat,
          subCat: subCat,
          subCatType: subCatType,
          name: name,
          path: path,
          color: color,
          price: price,
          username: username,
        });

        product.save();
        req.flash("addCart", "Item added to the Cart");
        res.redirect("/cart");
        //   res.render("cart",{bestitem: bestitem,trendingItems : items,username : req.cookies["username"],name : req.cookies["name"]});
      } else {
        res.redirect("/404login");
      }
    });
  });
});

app.get("/logout", function (req, res) {
  res.clearCookie("username");
  res.clearCookie("name");
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

// sanket shinde
app.get("/about", function (req, res) {
  // const urlObj = url.parse(req.url);
  // const queryParams = querystring.parse(urlObj.query);
  // console.log(queryParams.key1,queryParams.key2);
  res.render("about", {
    username: req.cookies["username"],
    name: req.cookies["name"],
  });
});

app.get("/login", function (req, res) {
  res.render("login", {
    username: req.cookies["username"],
    name: req.cookies["name"],
    failuremsg: req.flash("error"),
  });
});

app.get("/register", function (req, res) {
  res.render("register", {
    username: req.cookies["username"],
    name: req.cookies["name"],
  });
});

app.get("/shop", function (req, res) {
  const mainCat = "Shop";
  const subCat = "";
  All.find(function (err, items) {
    //  console.log(items);
    res.render("shop", {
      allItems: items,
      username: req.cookies["username"],
      name: req.cookies["name"],
      mainCat: mainCat,
      subCat: subCat,
    });
  });
});

app.get("/shopCat", function (req, res) {
  const urlObj = url.parse(req.url);
  const queryParams = querystring.parse(urlObj.query);
  const mainCat = queryParams.mainCat;
  const subCat = queryParams.subCat;
  // console.log(mainCat);
  // console.log(subCat);
  if (mainCat == "Men") {
    Men.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("shop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
      });
    });
  } else if (mainCat == "Women") {
    Women.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("shop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
      });
    });
  } else if (mainCat == "Kids") {
    Kid.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("shop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
      });
    });
  } else if (mainCat == "Mobile") {
    Mobile.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("shop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
      });
    });
  } else if (mainCat == "Computer") {
    Computer.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("shop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
      });
    });
  } else if (mainCat == "Bags") {
    Bag.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("shop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
      });
    });
  }
});

app.get("/addWishlist", function (req, res) {
  const urlObj = url.parse(req.url);
  const queryParams = querystring.parse(urlObj.query);
  const mainCat = queryParams.mainCat;
  const subCat = queryParams.subCat;
  const subCatType = queryParams.subCatType;
  const name = queryParams.name;
  const color = queryParams.color;
  const price = queryParams.price;
  const path = queryParams.path;
  const _id = queryParams._id;
  const username = req.cookies["username"];

  Wishlist.find(function (err, items) {
    if (req.cookies["username"] != undefined) {
      const wishlist = new Wishlist({
        product_id: _id,
        mainCat: mainCat,
        subCat: subCat,
        subCatType: subCatType,
        name: name,
        path: path,
        color: color,
        price: price,
        username: username,
      });

      wishlist.save();
      req.flash("wishlist", "Item added to the wishlist");
      res.redirect("/wishlist");
    } else {
      res.redirect("/404login");
    }
  });
});

app.get("/singleshop", function (req, res) {
  const urlObj = url.parse(req.url);
  const queryParams = querystring.parse(urlObj.query);
  const mainCat = queryParams.mainCat;
  const subCat = queryParams.subCat;
  const color = queryParams.color;
  const price = queryParams.price;
  const path = queryParams.path;
  const _id = queryParams._id;
  const subCatType = queryParams.subCatType;
  const pname = queryParams.name;

  if (mainCat == "Men") {
    Men.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("singleshop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
        color: color,
        price: price,
        path: path,
        _id: _id,
        subCatType: subCatType,
        pname: pname,
      });
    });
  } else if (mainCat == "Women") {
    Women.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("singleshop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
        color: color,
        price: price,
        path: path,
        _id: _id,
        subCatType: subCatType,
        pname: pname,
      });
    });
  } else if (mainCat == "Kids") {
    Kid.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("singleshop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
        color: color,
        price: price,
        path: path,
        _id: _id,
        subCatType: subCatType,
        pname: pname,
      });
    });
  } else if (mainCat == "Mobile") {
    Mobile.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("singleshop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
        color: color,
        price: price,
        path: path,
        _id: _id,
        subCatType: subCatType,
        pname: pname,
      });
    });
  } else if (mainCat == "Computer") {
    Computer.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("singleshop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
        color: color,
        price: price,
        path: path,
        _id: _id,
        subCatType: subCatType,
        pname: pname,
      });
    });
  } else if (mainCat == "Bags") {
    Bag.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
      // console.log(items);
      res.render("singleshop", {
        allItems: items,
        username: req.cookies["username"],
        name: req.cookies["name"],
        mainCat: mainCat,
        subCat: subCat,
        color: color,
        price: price,
        path: path,
        _id: _id,
        subCatType: subCatType,
        pname: pname,
      });
    });
  }
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    username: req.cookies["username"],
    name: req.cookies["name"],
  });
});

app.get("/cart", function (req, res) {
  if (req.cookies["username"] != undefined) {
    Cart.find(
      { username: req.cookies["username"] },
      function (err, foundproducts) {
        if (err) {
          console.log(err);
        } else {
          Cart.find({ username: req.cookies["username"] }).count(function (
            err,
            count
          ) {
            if (count > 0) {
              var subTotal = 0;
              var shipping = 0;
              var total = 0;
              foundproducts.forEach(function (products) {
                subTotal = subTotal + products.price;
                shipping = shipping + 20;
              });
              total = subTotal + shipping;
              if (count == 1) {
                res.render("cart", {
                  addCart: req.flash("addCart"),
                  username: req.cookies["username"],
                  name: req.cookies["name"],
                  foundproducts: foundproducts,
                  subTotal: subTotal,
                  shipping: shipping,
                  total: total,
                  deletemsg: "",
                });
              } else
                res.render("cart", {
                  addCart: req.flash("addCart"),
                  username: req.cookies["username"],
                  name: req.cookies["name"],
                  foundproducts: foundproducts,
                  subTotal: subTotal,
                  shipping: shipping,
                  total: total,
                  deletemsg: req.flash("deleteProduct"),
                });
            } else {
              res.redirect("/404cart");
            }
          });
        }
      }
    );
  } else {
    res.redirect("/404login");
  }
});

app.get("/checkout", function (req, res) {
  if (req.cookies["username"] != undefined) {
    Cart.find(
      { username: req.cookies["username"] },
      function (err, foundproducts) {
        if (err) {
          console.log(err);
        } else {
          Cart.find({ username: req.cookies["username"] }).count(function (
            err,
            count
          ) {
            if (count > 0) {
              var subTotal = 0;
              var shipping = 0;
              var total = 0;
              foundproducts.forEach(function (products) {
                subTotal = subTotal + products.price;
                shipping = shipping + 20;
              });
              total = subTotal + shipping;
              res.render("checkout", {
                username: req.cookies["username"],
                name: req.cookies["name"],
                foundproducts: foundproducts,
                subTotal: subTotal,
                shipping: shipping,
                total: total,
                order: req.flash("order"),
                ordererror: req.flash("ordererror"),
              });
            } else {
              res.redirect("/404order");
            }
          });
        }
      }
    );
  } else {
    res.redirect("/404login");
  }
});

app.get("/wishlist", function (req, res) {
  if (req.cookies["username"] != undefined) {
    Wishlist.find(
      { username: req.cookies["username"] },
      function (err, foundproducts) {
        if (err) {
          console.log(err);
        } else {
          Wishlist.find({ username: req.cookies["username"] }).count(function (
            err,
            count
          ) {
            if (count > 0) {
              if (count == 1) {
                res.render("wishlist", {
                  username: req.cookies["username"],
                  name: req.cookies["name"],
                  foundproducts: foundproducts,
                  wishlist: req.flash("wishlist"),
                  wishlistremove: "",
                });
              } else
                res.render("wishlist", {
                  username: req.cookies["username"],
                  name: req.cookies["name"],
                  foundproducts: foundproducts,
                  wishlist: req.flash("wishlist"),
                  wishlistremove: req.flash("wishlistremove"),
                });
            } else {
              res.redirect("/404wishlist");
            }
          });
        }
      }
    );
  } else {
    res.redirect("/404login");
  }
});

app.get("/order", function (req, res) {
  if (req.cookies["username"] != undefined) {
    Order.find(
      { username: req.cookies["username"] },
      function (err, foundproducts) {
        if (err) {
          console.log(err);
        } else {
          Order.find({ username: req.cookies["username"] }).count(function (
            err,
            count
          ) {
            if (count > 0) {
              if (count == 1) {
                res.render("order", {
                  username: req.cookies["username"],
                  name: req.cookies["name"],
                  foundproducts: foundproducts,
                  ordermsg: req.flash("order"),
                  orderremove: "",
                });
              } else
                res.render("order", {
                  username: req.cookies["username"],
                  name: req.cookies["name"],
                  foundproducts: foundproducts,
                  ordermsg: req.flash("order"),
                  orderremove: req.flash("orderremove"),
                });
            } else {
              res.redirect("/404order");
            }
          });
        }
      }
    );
  } else {
    res.redirect("/404login");
  }
});

app.get("/404", function (req, res) {
  res.render("404", {
    username: req.cookies["username"],
    name: req.cookies["name"],
  });
});

app.get("/404cart", function (req, res) {
  res.render("404cart", {
    username: req.cookies["username"],
    name: req.cookies["name"],
  });
});

app.get("/404login", function (req, res) {
  res.render("404login", {
    username: req.cookies["username"],
    name: req.cookies["name"],
  });
});

app.get("/404order", function (req, res) {
  res.render("404order", {
    username: req.cookies["username"],
    name: req.cookies["name"],
  });
});

app.get("/404wishlist", function (req, res) {
  res.render("404wishlist", {
    username: req.cookies["username"],
    name: req.cookies["name"],
  });
});

app.get("/deleteCartItem", function (req, res) {
  const urlObj = url.parse(req.url);
  const queryParams = querystring.parse(urlObj.query);
  Cart.deleteOne({ _id: queryParams.itemId }, function (err, products) {
    if (err) {
      console.log(err);
    } else {
      req.flash("deleteProduct", "Item removed from cart...");
      res.redirect("/cart");
    }
  });
});

app.get("/deleteWishlistItem", function (req, res) {
  const urlObj = url.parse(req.url);
  const queryParams = querystring.parse(urlObj.query);
  Wishlist.deleteOne({ _id: queryParams.itemId }, function (err, products) {
    if (err) {
      console.log(err);
    } else {
      req.flash("wishlistremove", "Item removed from Wishlist...");
      res.redirect("/wishlist");
    }
  });
});

app.get("/deleteOrder", function (req, res) {
  const urlObj = url.parse(req.url);
  const queryParams = querystring.parse(urlObj.query);
  res.render("deleteOrder", {
    username: req.cookies["username"],
    name: req.cookies["name"],
    deleteItemId: queryParams.itemId,
  });
});

app.post("/deleteOrderedItem", function (req, res) {
  const name = req.body.name;
  const mobile = req.body.mobile;
  const usermsg = req.body.usermsg;
  const deleteItemId = req.body.deleteItemId;

  Order.deleteOne({ _id: deleteItemId }, function (err, products) {
    if (err) {
      console.log(err);
    } else {
      // const deletedData=new Deletedorder({
      //     name:name,
      //     mobile:mobile,
      //     usermsg:usermsg,
      //     deleteItemId:deleteItemId
      // });
      // deletedData.save();
      req.flash("orderremove", "Order Cancelled successfully...");
      res.redirect("/order");
    }
  });
});

// POST requests
app.post("/register", function (req, res) {
  User.register(
    {
      username: req.body.username,
      name: req.body.name,
      mobile: req.body.mobile,
    },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.cookie("username", req.user.username);
          res.cookie("name", req.user.name);
          res.redirect("/");
        });
      }
    }
  );
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
      })(req, res, function () {
        res.cookie("username", req.user.username);
        res.cookie("name", req.user.name);
        res.redirect("/");
      });
    }
  });
});

app.post("/contact", function (req, res) {
  const name = req.body.name;
  const mobile = req.body.phone;
  const subject = req.body.subject;
  const message = req.body.message;

  const contact = new Contact({
    name: name,
    mobile: mobile,
    sub: subject,
    message: message,
  });

  contact.save();
  //   req.flash("contact","We will reach to you...");
  res.redirect("/");
});

app.post("/subscribe", function (req, res) {
  const email = req.body.email;

  const subscribe = new Subscribe({
    email: email,
  });

  subscribe.save();
  //   req.flash("contact","We will reach to you...");
  res.redirect("/");
});

app.post("/checkout", function (req, res) {
  const name = req.body.name;
  const username = req.body.username;
  const address = req.body.address;
  const mobile = req.body.mobile;
  const orderedProducts = req.body.orderedProducts;
  const orderedProductsid = req.body.orderedProductsid;
  const orderedProductspath = req.body.orderedProductspath;
  const subTotal = req.body.subTotal;
  const shipping = req.body.shipping;
  const total = req.body.total;
  const usermsg = req.body.usermsg;

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  const fullDate = `${day}-${month}-${year}`;

  const twoDaysLater = new Date(now.setDate(now.getDate() + 2));
  const day1 = twoDaysLater.getDate();
  const month1 = twoDaysLater.getMonth();
  const year1 = twoDaysLater.getFullYear();

  const fullDate1 = `${day1}-${month1}-${year1}`;

  // console.log(name,username,address,mobile,orderedProducts,subTotal,shipping,total);

  Order.find(function (err, items) {
    if (req.cookies["username"] == username) {
      const order = new Order({
        name: name,
        username: username,
        address: address,
        mobile: mobile,
        orderedProducts: orderedProducts,
        orderedProductsid: orderedProductsid,
        orderedProductspath: orderedProductspath,
        subTotal: subTotal,
        shipping: shipping,
        total: total,
        usermsg: usermsg,
        orderedDate: fullDate,
        deliveryDate: fullDate1,
      });

      order.save();
      req.flash("order", "Your order has been placed...");
      res.redirect("/order");
    } else {
      req.flash(
        "ordererror",
        "Please enter same username/email used while login!!!"
      );
      res.redirect("/checkout");
    }
  });
});

//-------------------------------------------------------------------------------------------------------

app.post("/searchItem", function (req, res) {
  const input = req.body.input;
  let availableKeywords = [
    "Men Belt",
    "Men sandle",
    "Men formalpants",
    "Men shortpants",
    "Men fulltshirts",
    "Men halftshirts",
    "Men Jeans",
    "Men Wallet",
    "Men formalshirts",
    "Men sportsshoes",
    "Men casualshoes",
    "Men casual shirts",
    "Men watch",
    "Men sunglasses",
    "Men formalshoes",
    "Men casualshoes",
    "Men trackpant",
    "Women bellies",
    "Women saree",
    "Women jwellery",
    "Women flats",
    "Women earrings",
    "Women bengle",
    "Women jutis",
    "Women kurtis",
    "Kids girlsfootwear",
    "Kids nightwear",
    "Kids boysfootwear",
    "Kids game",
    "Kids hardtoys",
    "Kids bottomwear",
    "Kids softtoys",
    "Kids topwear",
    "Mobile adapter",
    "Mobile powerbank",
    "Mobile storagedevice",
    "Mobile speaker",
    "Mobile typec",
    "Mobile wired earphones",
    "Mobile wireless earphones",
    "Mobile usb",
    "Mobile lightning",
    "Computer ethernet",
    "Computer HDD",
    "Computer monitor",
    "Computer wireless mouse",
    "Computer pendrive",
    "Computer SSD",
    "Computer wired mouse",
    "Computer wireless keyboard",
    "Computer hdmi",
    "Computer vgi",
    "Computer wired keyboard",
    "Bag laptopbag",
    "Bag travelling bag",
    "Bag mensbag",
    "Bag womenbag",
  ];
  if (availableKeywords.includes(input)) {
    var arr = input.split(" ");
    var mainCat = arr[0];
    var subCat = arr[1];
    //console.log(mainCat,subCat)
    if (mainCat == "Men") {
      Men.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
        // console.log(items);
        res.render("shop", {
          allItems: items,
          username: req.cookies["username"],
          name: req.cookies["name"],
          mainCat: mainCat,
          subCat: subCat,
        });
      });
    } else if (mainCat == "Women") {
      Women.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
        // console.log(items);
        res.render("shop", {
          allItems: items,
          username: req.cookies["username"],
          name: req.cookies["name"],
          mainCat: mainCat,
          subCat: subCat,
        });
      });
    } else if (mainCat == "Kids") {
      Kid.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
        // console.log(items);
        res.render("shop", {
          allItems: items,
          username: req.cookies["username"],
          name: req.cookies["name"],
          mainCat: mainCat,
          subCat: subCat,
        });
      });
    } else if (mainCat == "Mobile") {
      Mobile.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
        // console.log(items);
        res.render("shop", {
          allItems: items,
          username: req.cookies["username"],
          name: req.cookies["name"],
          mainCat: mainCat,
          subCat: subCat,
        });
      });
    } else if (mainCat == "Computer") {
      Computer.find(
        { mainCat: mainCat, subCat: subCat },
        function (err, items) {
          // console.log(items);
          res.render("shop", {
            allItems: items,
            username: req.cookies["username"],
            name: req.cookies["name"],
            mainCat: mainCat,
            subCat: subCat,
          });
        }
      );
    } else if (mainCat == "Bags") {
      Bag.find({ mainCat: mainCat, subCat: subCat }, function (err, items) {
        // console.log(items);
        res.render("shop", {
          allItems: items,
          username: req.cookies["username"],
          name: req.cookies["name"],
          mainCat: mainCat,
          subCat: subCat,
        });
      });
    }
  } else {
    res.redirect("/404login");
  }
});

app.listen(3000, function () {
  console.log("Server started on 3000");
});
