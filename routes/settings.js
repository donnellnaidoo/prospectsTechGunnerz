const express = require("express");
const router = express.Router();
const path = require("path");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, (req, res) =>
  res.render("setting", {
    userName: req.user.name,
    accountType: req.user.accountType,
  })
);
router.get("/messaging", (req, res) => res.render("messaging", users));
module.exports = router;
