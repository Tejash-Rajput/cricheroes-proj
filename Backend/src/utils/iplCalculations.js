// --- Util Functions ---

function ballsToOversFormat(balls) {
  let overs = Math.floor(balls / 6);
  let remBalls = balls % 6;
  return Number(`${overs}.${remBalls}`);
}

function oversToBallsFormat(overs) {
  let [fullOvers, partBalls] = String(overs).split('.');
  return Number(fullOvers) * 6 + Number(partBalls || 0);
}

function calculateRunRateTotal(runsMade, ballsUsed, runsGiven, ballsBowled) {
  let teamOversFaced = ballsUsed / 6;
  let teamOversBowled = ballsBowled / 6;
  if (teamOversFaced === 0 || teamOversBowled === 0) return 0;
  return Number((runsMade / teamOversFaced - runsGiven / teamOversBowled).toFixed(3));
}

function simulateGame(
  tableData,
  team,
  opponent,
  didWin,
  thisruns,
  ballsUsedThisMatch,
  runsConcededThisMatch,
  ballsBowledThisMatch
) {
  let clonedTable = JSON.parse(JSON.stringify(tableData));
  let player = clonedTable.find((t) => t.name === team);
  let clopponent = clonedTable.find((t) => t.name === opponent);
  if (!player || !clopponent) throw new Error('Team or opponent missing');

  player.gamesPlayed++;
  clopponent.gamesPlayed++;
  if (didWin) {
    player.victories++;
    player.scorePoints += 2;
    clopponent.defeats++;
  } else {
    clopponent.victories++;
    clopponent.scorePoints += 2;
    player.defeats++;
  }

  player.runsScored += thisruns;
  player.ballsFaced += ballsUsedThisMatch;
  player.runsAllowed += runsConcededThisMatch;
  player.ballsBowled += ballsBowledThisMatch;

  opponent.runsScored += runsConcededThisMatch;
  opponent.ballsFaced += ballsBowledThisMatch;
  opponent.runsAllowed += thisruns;
  opponent.ballsBowled += ballsUsedThisMatch;

  player.netRunRate = calculateRunRateTotal(
    player.runsScored,
    player.ballsFaced,
    player.runsAllowed,
    player.ballsBowled
  );
  opponent.netRunRate = calculateRunRateTotal(
    opponent.runsScored,
    opponent.ballsFaced,
    opponent.runsAllowed,
    opponent.ballsBowled
  );
  return clonedTable;
}

function rankTeam(tableData, team) {
  let sorted = [...tableData].sort((a, b) => {
    if (b.scorePoints !== a.scorePoints) return b.scorePoints - a.scorePoints;
    return b.netRunRate - a.netRunRate;
  });
  return sorted.findIndex((t) => t.name === team) + 1;
}

function findBattingRestriction(config, tableData) {
  let { team, opponent, runs, overs, desiredPosition } = config;
  let minimum = null,
    maximum = null,
    bestNrr = null,
    worstNrr = null,
    hasFound = false;

  for (let opponentRuns = 0; opponentRuns < runs; opponentRuns++) {
    let simTable = simulateGame(
      tableData,
      team,
      opponent,
      true,
      runs,
      overs * 6,
      opponentRuns,
      overs * 6
    );
    let resultData = simTable.find((t) => t.name === team);
    let pos = rankTeam(simTable, team);
    if (pos === desiredPosition) {
      if (!hasFound) {
        minimum = opponentRuns;
        bestNrr = resultData.netRunRate;
        hasFound = true;
      }
      maximum = opponentRuns;
      worstNrr = resultData.netRunRate;
    } else if (hasFound) {
      break;
    }
  }
  return {
    restrictionMin: minimum ?? 0,
    restrictionMax: maximum ?? 0,
    overs,
    nrrWorst: +(worstNrr ?? 0).toFixed(3),
    nrrBest: +(bestNrr ?? 0).toFixed(3),
  };
}

function findBowlingChase(config, tableData) {
  let { team, opponent, runs, overs, desiredPosition } = config;
  const chaseRuns = runs + 1,
    maxBalls = overs * 6;
  let minBalls = null,
    maxBallsAllowed = null,
    bestNrr = null,
    worstNrr = null,
    found = false;
  for (let ballsUsed = 6; ballsUsed <= maxBalls; ballsUsed++) {
    let simTable = simulateGame(
      tableData,
      team,
      opponent,
      true,
      chaseRuns,
      ballsUsed,
      runs,
      maxBalls
    );
    let resultData = simTable.find((t) => t.name === team);
    let pos = rankTeam(simTable, team);
    if (pos === desiredPosition) {
      if (!found) {
        minBalls = ballsUsed;
        bestNrr = resultData.netRunRate;
        found = true;
      }
      maxBallsAllowed = ballsUsed;
      worstNrr = resultData.netRunRate;
    } else if (found) {
      break;
    }
  }
  let displayOvers = (balls) => ballsToOversFormat(balls);
  return {
    chaseTarget: chaseRuns,
    minOvers: displayOvers(minBalls ?? 0),
    maxOvers: displayOvers(maxBallsAllowed ?? 0),
    nrrWorst: +(worstNrr ?? 0).toFixed(3),
    nrrBest: +(bestNrr ?? 0).toFixed(3),
  };
}

async function getPerformanceRange(config, tableData) {
  if (config.toss === 'bat') {
    return findBattingRestriction(config, tableData);
  } else {
    return findBowlingChase(config, tableData);
  }
}

module.exports = {
  getPerformanceRange,
  calculateRunRateTotal,
  simulateGame,
  rankTeam,
  ballsToOversFormat,
  oversToBallsFormat,
};
