const express = require("express");

const router = express.Router();

const expenseContollers = require("../controllers/expenseControllers");
const middleware = require("../middleware/auth");

router.get(
  "/user-expense/:userid",
  middleware.authenticate,
  expenseContollers.getOneUser
);

router.get("/", middleware.authenticate, expenseContollers.isPremUser);

router.get(
  "/usersExpense",
  middleware.authenticate,
  expenseContollers.usersExpense
);

router.get(
  "/getExpenses",
  middleware.authenticate,
  expenseContollers.getExpenses
);

router.post(
  "/postExpense",
  middleware.authenticate,
  expenseContollers.postExpense
);

router.delete(
  "/deleteExpense/:expenseId",
  middleware.authenticate,
  expenseContollers.deleteExpense
);

// router.get(
//   "/downloadExpense",
//   middleware.authenticate,
//   expenseContollers.downloadExpense
// );

module.exports = router;
