//here

const contfun = require("../controller/procontrollerfun.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
dotenv.config();
router.post("/register", contfun.posdata);
router.post("/login", contfun.logdata);
router.get("/getsingleproduct/:id", contfun.getproduct);
router.get("/getallproduct", contfun.getallproduct);
//jwtverification middleware
const secret = process.env.secretkey;
const tokmiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    if (!token) {
      return res.status(400).send("token mssing");
    }
    const decode = jwt.verify(token, secret);
    req.user = decode;
    next();
  } catch (err) {
    res.status(401).send("token is invalid");
  }
};
//admin middleware
const isadmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send("admin only access");
  }
  next();
};
router.post("/postproduct", tokmiddleware, isadmin, contfun.postproduct);
router.put("/updateproduct/:id", tokmiddleware, isadmin, contfun.updateproduct);
router.delete(
  "/deleteproduct/:id",
  tokmiddleware,
  isadmin,
  contfun.deleteproduct
);

//cartmiddleware
const cartmiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    if (!token) {
      return res.status(400).send("please login first");
    }
    const decode = jwt.verify(token, secret);
    req.user = decode;
    next();
  } catch (err) {
    res.status(401).send("token is invalid");
  }
};
router.post("/addcart", cartmiddleware, contfun.addcart);
router.get("/getcart", cartmiddleware, contfun.getcart);
router.delete("/delcart", cartmiddleware, contfun.removecartitem);
router.put("/updatecart", cartmiddleware, contfun.updatequantity);

//ORDERS
const ordermiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    if (!token) {
      return res.status(400).send("please login first");
    }
    const decode = jwt.verify(token, secret);
    req.user = decode;
    next();
  } catch (err) {
    res.status(401).send("token is invalid");
  }
};
router.post("/placeorder", ordermiddleware, contfun.placeorder);

router.get("/getorder", ordermiddleware, contfun.getorder);
router.get("/getallorder", tokmiddleware, isadmin, contfun.getallorder);
router.put("/updatestatus/:id", tokmiddleware, isadmin, contfun.updatestatus);
router.put("/cancelorder/:id", tokmiddleware, contfun.cancelorder);
router.put("/payment", tokmiddleware, contfun.payment);
router.get("/fix-orders", tokmiddleware, isadmin, contfun.fixBrokenOrders);
module.exports = router;
