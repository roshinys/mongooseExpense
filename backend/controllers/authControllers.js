const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 8;

exports.postUser = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    if (!email.includes("@")) {
      throw new Error("not a valid email");
    }
    const password = req.body.password.toString();
    if (!username || !email || !password) {
      throw new Error("input needed backend");
    }
    const hashPass = await bcrypt.hash(password, saltRounds);
    const newuser = new User({
      username: username,
      email: email,
      password: hashPass,
    });
    newuser.save();
    res.json({ newuser, msg: "created user", success: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: "unable to create user", success: false });
  }
};

exports.getUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password.toString();
    const user = await User.findOne({ email: email });
    // console.log("user ===>", user);
    if (user.length === 0) {
      res.status(404).json({ msg: false, msgText: "no user exists" });
      return;
    }
    const result = await bcrypt.compare(password, user.password);
    console.log("password match ===>", result);
    if (!result) {
      res.status(401).json({ msg: false, msgText: "check password" });
      return;
    }
    const userId = user._id.toString();
    // console.log("userid ===>", userId);
    const jwttoken = generateToken(userId);
    res.json({
      token: jwttoken,
      success: true,
      msg: "Successfully Logged In",
    });
  } catch (err) {
    console.log(err);
    res.json({ msg: false, err });
  }
};

function generateToken(id) {
  return jwt.sign(id, process.env.PRIVATEKEY);
}
