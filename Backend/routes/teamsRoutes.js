const express = require("express");
const router = express.Router();
const teamsController = require("../controllers/teamsController");

router.get("/", teamsController.getTeams);

module.exports = router;
