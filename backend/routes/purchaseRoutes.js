const express = require("express");
const router = express.Router();

const purchaseContollers = require("../controllers/purchaseControllers");
const middleware = require("../middleware/auth");

router.get(
  "/premiummembership",
  middleware.authenticate,
  purchaseContollers.purchasepremium
);

router.post(
  "/updatetransactionstatus",
  middleware.authenticate,
  purchaseContollers.updateTransactionStatus
);

module.exports = router;
