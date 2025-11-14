// --- Helper Functions ---

/**
 * Converts total balls into a decimal representation of overs.
 */
const ballsToOvers = (balls) => {
  const wholeOvers = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return wholeOvers + remainingBalls / 6;
};

/**
 * Converts a decimal overs representation back to O.B format.
 */
const decimalOversToDisplay = (decimalOvers) => {
  const totalBalls = Math.round(decimalOvers * 6);
  const ov = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  return parseFloat(`${ov}.${balls}`);
};

/**
 * Calculates NRR for a team.
 */
function calculateNRR(runsFor, ballsFaced, runsAgainst, ballsBowled) {
  const oversFaced = ballsToOvers(ballsFaced);
  const oversBowled = ballsToOvers(ballsBowled);
  if (oversFaced === 0 || oversBowled === 0) return 0;
  return Number((runsFor / oversFaced - runsAgainst / oversBowled).toFixed(3));
}

/**
 * Simulates a match and returns a new points table.
 */
function simulateMatch(
  pointsTable,
  team,
  opponent,
  teamWon,
  runsForMatch,
  ballsFacedMatch,
  runsAgainstMatch,
  ballsBowledMatch
) {
  const newTable = JSON.parse(JSON.stringify(pointsTable));
  const teamData = newTable.find((t) => t.team === team);
  const oppData = newTable.find((t) => t.team === opponent);
  if (!teamData || !oppData) throw new Error('Team or opponent not found');

  teamData.matches++;
  oppData.matches++;

  if (teamWon) {
    teamData.wins++;
    teamData.points += 2;
    oppData.losses++;
  } else {
    oppData.wins++;
    oppData.points += 2;
    teamData.losses++;
  }

  teamData.runsFor += runsForMatch;
  teamData.ballsFaced += ballsFacedMatch;
  teamData.runsAgainst += runsAgainstMatch;
  teamData.ballsBowled += ballsBowledMatch;

  oppData.runsFor += runsAgainstMatch;
  oppData.ballsFaced += ballsBowledMatch;
  oppData.runsAgainst += runsForMatch;
  oppData.ballsBowled += ballsFacedMatch;

  teamData.nrr = calculateNRR(
    teamData.runsFor,
    teamData.ballsFaced,
    teamData.runsAgainst,
    teamData.ballsBowled
  );
  oppData.nrr = calculateNRR(
    oppData.runsFor,
    oppData.ballsFaced,
    oppData.runsAgainst,
    oppData.ballsBowled
  );

  return newTable;
}

/**
 * Gets team position (1 = top).
 */
function getTeamPosition(pointsTable, team) {
  const sorted = [...pointsTable].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.nrr - a.nrr;
  });
  return sorted.findIndex((t) => t.team === team) + 1;
}

function findRestrictRangeBatting(input, pointsTable) {
  const { team, opponent, runs, overs, desiredPosition } = input;

  let minRestrict = null;
  let maxRestrict = null;
  let bestNRR = null,
    worstNRR = null;
  let inRange = false;

  for (let oppRuns = 0; oppRuns < runs; oppRuns++) {
    const sim = simulateMatch(
      pointsTable,
      team,
      opponent,
      true,
      runs,
      overs * 6,
      oppRuns,
      overs * 6
    );
    const rr = sim.find((t) => t.team === team);
    const pos = getTeamPosition(sim, team);

    if (pos === desiredPosition) {
      if (!inRange) {
        minRestrict = oppRuns;
        bestNRR = rr.nrr;
        inRange = true;
      }
      maxRestrict = oppRuns;
      worstNRR = rr.nrr;
    } else if (inRange) {
      break;
    }
  }

  return {
    minRestrictRuns: minRestrict ?? 0,
    maxRestrictRuns: maxRestrict ?? 0,
    overs,
    revisedNRRMin: +(worstNRR ?? 0).toFixed(3),
    revisedNRRMax: +(bestNRR ?? 0).toFixed(3),
  };
}

function findChaseRangeBowling(input, pointsTable) {
  const { team, opponent, runs, overs, desiredPosition } = input;
  const target = runs + 1;
  const maxBalls = overs * 6;

  let minBalls = null;
  let maxBallsAllowed = null;
  let bestNRR = null,
    worstNRR = null;
  let inRange = false;

  for (let ballsFaced = 6; ballsFaced <= maxBalls; ballsFaced++) {
    const sim = simulateMatch(
      pointsTable,
      team,
      opponent,
      true,
      target,
      ballsFaced,
      runs,
      maxBalls
    );
    const rr = sim.find((t) => t.team === team);
    const pos = getTeamPosition(sim, team);

    if (pos === desiredPosition) {
      if (!inRange) {
        minBalls = ballsFaced;
        bestNRR = rr.nrr;
        inRange = true;
      }
      maxBallsAllowed = ballsFaced;
      worstNRR = rr.nrr;
    } else if (inRange) {
      break;
    }
  }

  const toDisplay = (balls) => {
    const o = Math.floor(balls / 6);
    const b = balls % 6;
    return +(o + b / 10).toFixed(1);
  };

  return {
    runsToChase: target,
    minOvers: toDisplay(minBalls ?? 0),
    maxOvers: toDisplay(maxBallsAllowed ?? 0),
    revisedNRRMin: +(worstNRR ?? 0).toFixed(3),
    revisedNRRMax: +(bestNRR ?? 0).toFixed(3),
  };
}

/**
 * Main controller
 */
async function calculatePerformanceRange(input, pointsTable) {
  if (input.toss === 'bat') {
    return findRestrictRangeBatting(input, pointsTable);
  } else {
    return findChaseRangeBowling(input, pointsTable);
  }
}

module.exports = {
  calculatePerformanceRange,
  calculateNRR,
  simulateMatch,
  getTeamPosition,
  ballsToOvers,
  decimalOversToDisplay,
};
