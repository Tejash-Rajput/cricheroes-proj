const express = require("express");
const router = express.Router();
const pointsTableController = require("../controllers/pointsTableController");

router.get("/", pointsTableController.getPointsTable);

module.exports = router;
