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
//hwtverification middleware
const secret = process.env.secretkey;
const tokmiddleware = (req, res, next) => {
  token = req.headers.authorization.split(" ")[1];

  try {
    if (!token) {
      return res.status(400).send("token mssing");
    }
    const decode = jwt.verify(token, secret);
    req.userr = decode;
    next();
  } catch (err) {
    res.status(401).send("token is invalid");
  }
};
//admin middleware
const isadmin = (req, res, next) => {
  if (req.userr.role !== "admin") {
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
module.exports = router;
