const express = require("express");
const router = express.Router();

const bankAccountController = require("../controllers/bankAccountController");

router.post("/accounts", bankAccountController.createAccount);
router.get("/accounts", bankAccountController.getAccounts);
router.get("/accounts/:accountId", bankAccountController.getAccountById);

module.exports = router;
