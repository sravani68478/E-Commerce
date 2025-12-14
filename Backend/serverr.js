//here

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routing = require("./Product/routing/routingfn.js");

const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());
app.use("/api", routing);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongodb connected succesfully");
  })
  .catch((err) => {
    console.log("error", err);
  });
app.listen(PORT, () => {
  console.log("server running succefulluy");
});
