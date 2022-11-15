const uuid = require("uuid");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const User = require("../models/User");
const ForgotPassword = require("../models/ForgotPass");

exports.updatePass = async (req, res) => {
  try {
    const resetpassid = req.params.id;
    const newpass = req.query.newpassword.toString();
    const response = await ForgotPassword.find({ uuid: resetpassid });
    const userId = response[0].userId;
    const user = await User.findById(userId);
    const newhashpass = await bcrypt.hash(newpass, saltRounds);
    // const updateduser = await user.update({ password: newhashpass });
    user.password = newhashpass;
    user.save();
    res.status(200).json({ msg: "ok", user });
  } catch (err) {
    res.status(404).json({ msg: false });
  }
};

exports.forgotpass = async (req, res) => {
  try {
    const email = req.body.email;
    const users = await User.find({ where: { email: email } });
    const user = users[0];
    if (!user) {
      throw new Error("user not in db");
    }
    const id = uuid.v4();
    const response = new ForgotPassword({
      uuid: id,
      isActive: true,
      userId: user._id,
    });
    response.save();
    res
      .status(200)
      .json({ msg: true, link: `http://localhost:3000/resetPass/${id}` });
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: false });
  }
};

exports.resetPass = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ForgotPassword.find({ uuid: id });
    if (response.isActive) {
      throw new Error("cant use the same link again to change pass");
    }
    await ForgotPassword.findOneAndUpdate(
      { uuid: id },
      { $set: { isActive: true } }
    );
    res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: "smtg went wrong" });
  }
};
