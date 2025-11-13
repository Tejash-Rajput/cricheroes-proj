const ballsToOvers = (balls) => {
  const wholeOvers = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return wholeOvers + remainingBalls / 6;
};

function calculateNRR(runsFor, ballsFaced, runsAgainst, ballsBowled) {
  const oversFaced = ballsToOvers(ballsFaced);
  const oversBowled = ballsToOvers(ballsBowled);
  if (oversFaced === 0 || oversBowled === 0) return 0;
  return Number(((runsFor / oversFaced) - (runsAgainst / oversBowled)).toFixed(3));
}

function simulateMatch(pointsTable, team, opponent, teamWon, runsForMatch, ballsFacedMatch, runsAgainstMatch, ballsBowledMatch) {
  const newTable = JSON.parse(JSON.stringify(pointsTable));
  const teamData = newTable.find(t => t.team === team);
  const oppData = newTable.find(t => t.team === opponent);
  if (!teamData || !oppData) {
    throw new Error('Team or opponent not found');
  }

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
  teamData.nrr = calculateNRR(teamData.runsFor, teamData.ballsFaced, teamData.runsAgainst, teamData.ballsBowled);
  oppData.nrr = calculateNRR(oppData.runsFor, oppData.ballsFaced, oppData.runsAgainst, oppData.ballsBowled);
  return newTable;
}

function getTeamPosition(pointsTable, team) {
  const sorted = [...pointsTable].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.nrr - a.nrr;
  });
  return sorted.findIndex(t => t.team === team) + 1;
}

// --- Key: Tighter min/max bounds for opponent runs ---
function simulateWithOpponentRange(pointsTable, input, baseRuns, ballsFaced, opponentRange = 2) {
  let worstPos = 1000;
  let worstTable = null;
  // Don't allow unrealistic low/high values; min = max(30, 80% of base), max = min(base+10, 120% of base, overs*15)
  const minOpponentRuns = Math.max(30, Math.floor(baseRuns * 0.8));
  const maxOpponentRuns = Math.min(baseRuns + 10, Math.floor(baseRuns * 1.2), input.overs * 15);

  for (let oppRuns = minOpponentRuns; oppRuns <= maxOpponentRuns; oppRuns += 1) {
    const simTable = simulateMatch(pointsTable, input.team, input.opponent, true, baseRuns, ballsFaced, oppRuns, ballsFaced);
    const pos = getTeamPosition(simTable, input.team);
    if (pos < worstPos) {
      worstPos = pos;
      worstTable = simTable;
    }
  }
  return { worstPos, worstTable };
}

function findRunsRangeBatting(input, pointsTable, epsilon = 0.01) {
  // Max bound: can't defend opponent scoring much more than you + 10 or 120%
  const maxRunsPossible = Math.min(input.runs + 10, Math.floor(input.runs * 1.2), input.overs * 15);
  let low = Math.max(30, Math.floor(input.runs * 0.8));
  let high = maxRunsPossible;
  let minRuns = null, maxRuns = null;

  while ((high - low) > epsilon) {
    const mid = (low + high) / 2;
    const ballsFaced = input.overs * 6;
    const { worstPos } = simulateWithOpponentRange(pointsTable, input, mid, ballsFaced, 2);
    if (worstPos <= input.desiredPosition) {
      minRuns = mid;
      high = mid;
    } else {
      low = mid;
    }
  }
  if (minRuns === null) return { minRuns: 0, maxRuns: 0 };
  low = minRuns;
  high = maxRunsPossible;
  while ((high - low) > epsilon) {
    const mid = (low + high) / 2;
    const ballsFaced = input.overs * 6;
    const { worstPos } = simulateWithOpponentRange(pointsTable, input, mid, ballsFaced, 2);
    if (worstPos <= input.desiredPosition) {
      maxRuns = mid;
      low = mid;
    } else {
      high = mid;
    }
  }
  return {
    minRuns: Math.round(minRuns * 100) / 100,
    maxRuns: Math.round(maxRuns * 100) / 100
  };
}

function findOversRangeBowling(input, pointsTable, epsilon = 0.1) {
  // Reasonable min chase: at least 8 overs for T20, max = full quota
  let low = 8, high = input.overs;
  let minOvers = null, maxOvers = null;
  while ((high - low) > epsilon) {
    const mid = (low + high) / 2;
    const ballsFaced = mid * 6;
    const { worstPos } = simulateWithOpponentRange(pointsTable, input, input.runs, ballsFaced);
    if (worstPos <= input.desiredPosition) {
      minOvers = mid;
      high = mid;
    } else {
      low = mid;
    }
  }
  if (minOvers === null) return { minOvers: 0, maxOvers: 0 };
  low = minOvers;
  high = input.overs;
  while ((high - low) > epsilon) {
    const mid = (low + high) / 2;
    const ballsFaced = mid * 6;
    const { worstPos } = simulateWithOpponentRange(pointsTable, input, input.runs, ballsFaced);
    if (worstPos <= input.desiredPosition) {
      maxOvers = mid;
      low = mid;
    } else {
      high = mid;
    }
  }
  return {
    minOvers: Math.round(minOvers * 100) / 100,
    maxOvers: Math.round(maxOvers * 100) / 100
  };
}

async function calculatePerformanceRange(input, pointsTable) {
  if (input.toss === 'bat') {
    const { minRuns, maxRuns } = findRunsRangeBatting(input, pointsTable);
    if (minRuns === null || maxRuns === null) {
      return {
        minRestrictRuns: 0,
        maxRestrictRuns: 0,
        overs: input.overs,
        revisedNRRMin: 0,
        revisedNRRMax: 0
      };
    }
    const simMinTable = simulateMatch(pointsTable, input.team, input.opponent, true, minRuns, input.overs * 6, minRuns, input.overs * 6);
    const simMaxTable = simulateMatch(pointsTable, input.team, input.opponent, true, maxRuns, input.overs * 6, maxRuns, input.overs * 6);
    return {
      minRestrictRuns: minRuns,
      maxRestrictRuns: maxRuns,
      overs: input.overs,
      revisedNRRMin: Number(simMinTable.find(t => t.team === input.team).nrr.toFixed(3)),
      revisedNRRMax: Number(simMaxTable.find(t => t.team === input.team).nrr.toFixed(3)),
    };
  } else {
    const { minOvers, maxOvers } = findOversRangeBowling(input, pointsTable);
    if (minOvers === null || maxOvers === null) {
      return {
        runsToChase: input.runs,
        minOvers: 0,
        maxOvers: 0,
        revisedNRRMin: 0,
        revisedNRRMax: 0,
      };
    }
    const simMinTable = simulateMatch(pointsTable, input.team, input.opponent, true, input.runs, minOvers * 6, input.runs, minOvers * 6);
    const simMaxTable = simulateMatch(pointsTable, input.team, input.opponent, true, input.runs, maxOvers * 6, input.runs, maxOvers * 6);
    return {
      runsToChase: input.runs,
      minOvers,
      maxOvers,
      revisedNRRMin: Number(simMinTable.find(t => t.team === input.team).nrr.toFixed(3)),
      revisedNRRMax: Number(simMaxTable.find(t => t.team === input.team).nrr.toFixed(3)),
    };
  }
}

module.exports = { 
  calculatePerformanceRange,
  calculateNRR,
  simulateMatch,
  getTeamPosition,
  ballsToOvers
};
