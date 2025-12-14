//here
const productmodel = require("../Model/Product.js");
const permod = require("../Model/Person.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
//posting data
const postproduct = async (req, res) => {
  try {
    const { name, price, discription, image } = req.body;
    const userr = new productmodel({ name, price, discription, image });
    await userr.save();
    res.status(201).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//UPDATE DATA
const updateproduct = async (req, res) => {
  try {
    const { name, price, discription, image } = req.body;
    const userr = await productmodel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        discription,
        image,
      },
      { new: true }
    );
    res.status(201).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//DELETE PRODUCT
const deleteproduct = async (req, res) => {
  try {
    const userr = await productmodel.findByIdAndDelete(req.params.id);
    res.status(200).send("product deleted");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//GET A SINGLE PRODUCT
const getproduct = async (req, res) => {
  try {
    const userr = await productmodel.findById(req.params.id);
    if (!userr) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//GET ALL PRODUCTS
const getallproduct = async (req, res) => {
  try {
    const userr = await productmodel.find();
    res.status(200).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//REGISTER
const posdata = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await permod.findOne({ email });
    if (user) {
      return res.status(400).send("user already exist");
    }
    const userr = new permod({ name, email, password, role });
    await userr.save();
    res.status(201).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const secret = process.env.secretkey;
//LOGIN
const logdata = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await permod.findOne({ email });
    if (!user) {
      return res.status(400).send(" no emailuser not exist");
    }
    const checkpass = await bcrypt.compare(password, user.password);
    if (!checkpass) {
      return res.status(400).send(" wrong pass user not exist");
    }
    //creating token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secret
    );
    res.status(200).json({ userdata: user, token: token });
  } catch (err) {
    res.send({ msg: err.message });
  }
};
module.exports = {
  postproduct,
  updateproduct,
  getproduct,
  getallproduct,
  deleteproduct,
  posdata,
  logdata,
};
