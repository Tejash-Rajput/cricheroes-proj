const pointsTable = require('../data/pointsTable.json'); // Updated path for new table format
const { getPerformanceRange } = require('../utils/iplCalculations');

exports.handlePerformanceQuery = async (req, res) => {
  const { team, opponent, overs, runs, toss, desiredPosition } = req.cleanedBody;
  try {
    const perfOutcome = await getPerformanceRange(
      {
        team,
        opponent,
        overs: Number(overs),
        runs: Number(runs),
        toss,
        desiredPosition: Number(desiredPosition),
      },
      pointsTable
    );

    res.json({
      team,
      opponent,
      overs,
      perfOutcome,
      summary: {
        restrictionMin: perfOutcome.restrictionMin,
        restrictionMax: perfOutcome.restrictionMax,
        runs,
        overs: Number(overs),
      },
      nrrRange: {
        min: perfOutcome.nrrWorst,
        max: perfOutcome.nrrBest,
      },
      pointsTable,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Simulation failed' });
  }
};
