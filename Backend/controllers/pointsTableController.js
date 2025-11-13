const pointsTable = require("../data/pointsTable.json");

exports.getPointsTable = (req, res) => {
  res.json(pointsTable);
};
