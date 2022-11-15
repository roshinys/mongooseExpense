const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: false }));

//db
const mongoose = require("mongoose");

//routers
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoute");
const purchaseRoutes = require("./routes/purchaseRoutes");
const forgotpassRoutes = require("./routes/resetPassRoute");

//exporting models
const User = require("./models/User");
const Expense = require("./models/Expense");
const Order = require("./models/Order");
const ForgotPass = require("./models/ForgotPass");

app.use("/", authRoutes);
app.use("/", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/", forgotpassRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("am i here");
    app.listen(process.env.PORT, () => {
      console.log("server started at port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
