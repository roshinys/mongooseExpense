const User = require("../models/User");
const Expense = require("../models/Expense");

const AWS = require("aws-sdk");

var expensePerPage = 2;

async function uploadtos3(data, filename) {
  const BucketName = process.env.BUCKETNAME;
  const IAMUSERKEY = process.env.IAMUSERKEY;
  const IAMUSERSECRET = process.env.IAMUSERSECRETKEY;
  let s3bucket = new AWS.S3({
    accessKeyId: IAMUSERKEY,
    secretAccessKey: IAMUSERSECRET,
    // bucket: BucketName,
  });

  var params = {
    Bucket: BucketName,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("smtg went wrong", err);
        reject(err);
      } else {
        // console.log("succesfully uploaded to s3", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

exports.downloadExpense = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    const stringfiedexpense = JSON.stringify(expenses);
    const userid = req.user.id;
    const filename = `Expense${userid}/${new Date()}.txt`;
    const fileurl = await uploadtos3(stringfiedexpense, filename);
    // console.log(fileurl);
    res.status(200).json({ msg: true, fileurl });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: false });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const userid = req.params.userid;
    const user = await User.findById(userid);
    const expense = await Expense.find({ userId: user._id });
    res.status(200).json({ msg: true, expense });
  } catch (err) {
    console.log(err);
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const quantity = parseInt(req.query.quantity);
    let page = req.query.page || 1;
    let hasPrev = true;
    let hasNext = true;
    if (page == 1) {
      hasPrev = false;
    }
    const expenses = await Expense.find({ userId: req.user._id })
      .skip((page - 1) * quantity)
      .limit(quantity);
    const count = await Expense.find({ userId: req.user._id });
    if (count.length / quantity <= page) {
      hasNext = false;
    }
    res.json({ expenses, msg: true, hasPrev, hasNext, page });
  } catch (err) {
    console.log(err);
    res.status(401).send({ msg: false });
  }
};

exports.postExpense = async (req, res) => {
  try {
    const expense = req.body.expense;
    const description = req.body.description;
    const category = req.body.category;
    const newExpense = new Expense({
      expense: expense,
      description: description,
      category: category,
      userId: req.user,
    });
    newExpense.save();
    // console.log(expense, description, category, newExpense);
    res.json({ msg: true, newExpense });
  } catch (err) {
    console.log(err);
    res.status(404).json({ msg: false });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const id = req.params.expenseId;
    const removedExpense = await Expense.deleteOne({
      _id: id,
      userId: req.user.id,
    });
    res.status(202).json({ id, removedExpense });
  } catch (err) {
    res.status(404).json({ msg: false });
  }
};

exports.isPremUser = async (req, res) => {
  if (!req.user.isPremium) {
    return res.status(200).json({ isPrem: false });
  } else {
    return res.status(200).json({ isPrem: true });
  }
};

exports.usersExpense = async (req, res) => {
  try {
    const userloggedin = req.user;
    let userExpense = [];
    const users = await User.find();
    for (let i = 0; i < users.length; i++) {
      let obj = {};
      obj.id = users[i]._id;
      obj.username = users[i].username;
      let total = await exp(users[i]);
      obj.total = total;
      userExpense.push({ ...obj });
    }
    res.status(200).json({ userExpense });
    return;
  } catch (err) {
    console.log(err);
    res.status(404).json({ mag: "this is a prem feature" });
    return;
  }
};

async function exp(user) {
  const expenses = await Expense.find({ userId: user._id });
  return new Promise((resolve, reject) => {
    let total = 0;
    expenses.forEach((ex) => {
      total += parseInt(ex.expense);
    });
    resolve(total);
  });
}
