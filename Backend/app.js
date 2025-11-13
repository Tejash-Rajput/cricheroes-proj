const express = require("express");
const cors = require("cors");

const calculateRoutes = require("./routes/calculateRoutes");
const pointsTableRoutes = require("./routes/pointsTableRoutes");
const teamsRoutes = require("./routes/teamsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/calculate", calculateRoutes);
app.use("/api/points-table", pointsTableRoutes);
app.use("/api/teams", teamsRoutes);

app.get("/", (req, res) => {
  res.send("IPL Points Table API Running");
});

module.exports = app;
