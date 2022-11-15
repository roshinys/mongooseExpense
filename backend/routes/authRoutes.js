const express = require("express");

const router = express.Router();

const authContollers = require("../controllers/authControllers");

router.post("/postUser", authContollers.postUser);
router.post("/getUser", authContollers.getUser);

module.exports = router;
