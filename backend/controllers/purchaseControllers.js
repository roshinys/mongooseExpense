const Razorpay = require("razorpay");
const Order = require("../models/Order");

exports.purchasepremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RZRID,
      key_secret: process.env.RZRKEY,
    });
    const amount = 1000;
    const order = await rzp.orders.create({ amount, currency: "INR" });
    const neworder = await new Order({
      orderid: order.id,
      status: "PENDING",
      payementid: null,
      userId: req.user,
    });
    neworder.save();
    res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderid: order_id },
      {
        $set: {
          paymentid: payment_id,
          status: "SUCCESSFUL",
        },
      }
    );
    req.user.isPremium = true;
    req.user.save();
    return res
      .status(202)
      .json({ sucess: true, message: "Transaction Successful" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};
