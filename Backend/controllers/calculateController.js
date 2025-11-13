const pointsTable = require("../data/pointsTable.json");
const { calculatePerformanceRange } = require("../utils/iplCalculations");

exports.calculatePerformance = async (req, res) => {
  const { team, opponent, overs, runs, toss, desiredPosition } = req.body;
  console.log(team, opponent, overs, runs, toss, desiredPosition);

  if (!team || !opponent || !overs || runs === undefined || !toss || !desiredPosition) {
    return res.status(400).json({ error: "Missing required input fields." });
  }

  try {
    const calculationResult = await calculatePerformanceRange(
      { team, opponent, overs: Number(overs), runs: Number(runs), toss, desiredPosition: Number(desiredPosition) },
      pointsTable
    );
    console.log(calculationResult,"ibrgr");
    

    res.json({
      team, opponent, overs,calculationResult,
      performanceRange: {
        minRestrictRuns: calculationResult.minRestrictRuns,
        maxRestrictRuns: calculationResult.maxRestrictRuns,
        runs,
        overs: Number(overs),
      },
      nrrRange: {
        min: calculationResult.revisedNRRMin,
        max: calculationResult.revisedNRRMax,
      },
      pointsTable,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Calculation error" });
  }
};
