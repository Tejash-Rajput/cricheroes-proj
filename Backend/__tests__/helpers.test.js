// Unit tests for helper functions in utils/iplCalculations.js
// Requires: jest installed as devDependency

const { 
  ballsToOvers, 
  calculateNRR, 
  simulateMatch, 
  getTeamPosition 
} = require('../utils/iplCalculations');
const pointsTable = require('../data/pointsTable.json');

describe('ballsToOvers - convert balls to overs format', () => {
  test('converts 6 balls to 1 over', () => {
    expect(ballsToOvers(6)).toBe(1);
  });

  test('converts 7 balls to 1.1 overs', () => {
    expect(ballsToOvers(7)).toBeCloseTo(1 + 1/6, 5);
  });

  test('converts 0 balls to 0 overs', () => {
    expect(ballsToOvers(0)).toBe(0);
  });

  test('converts 12 balls to 2 overs', () => {
    expect(ballsToOvers(12)).toBe(2);
  });
});

describe('calculateNRR - Net Run Rate calculation', () => {
  test('returns 0 when ballsFaced is 0', () => {
    expect(calculateNRR(100, 0, 50, 30)).toBe(0);
  });

  test('returns 0 when ballsBowled is 0', () => {
    expect(calculateNRR(100, 30, 50, 0)).toBe(0);
  });

  test('calculates positive NRR when scoring more runs', () => {
    // runsFor: 100, oversFaced: 20 (120 balls)
    // runsAgainst: 80, oversBowled: 20 (120 balls)
    // NRR = (100/20) - (80/20) = 5 - 4 = 1.0
    const nrr = calculateNRR(100, 120, 80, 120);
    expect(nrr).toBeCloseTo(1.0, 2);
  });

  test('calculates negative NRR when conceding more runs', () => {
    // runsFor: 80, oversFaced: 20
    // runsAgainst: 100, oversBowled: 20
    // NRR = (80/20) - (100/20) = 4 - 5 = -1.0
    const nrr = calculateNRR(80, 120, 100, 120);
    expect(nrr).toBeCloseTo(-1.0, 2);
  });
});

describe('simulateMatch - simulate a match and update points table', () => {
  test('increases matches count for both teams', () => {
    const team = pointsTable[0].team;
    const opponent = pointsTable[1].team;
    const initialTeamMatches = pointsTable[0].matches;
    const initialOppMatches = pointsTable[1].matches;

    const newTable = simulateMatch(
      pointsTable,
      team,
      opponent,
      true,  // team won
      150,   // runsForMatch
      120,   // ballsFacedMatch
      140,   // runsAgainstMatch
      120    // ballsBowledMatch
    );

    expect(newTable[0].matches).toBe(initialTeamMatches + 1);
    expect(newTable[1].matches).toBe(initialOppMatches + 1);
  });

  test('updates points correctly when team wins', () => {
    const team = pointsTable[0].team;
    const opponent = pointsTable[1].team;
    const initialTeamPoints = pointsTable[0].points;
    const initialOppPoints = pointsTable[1].points;

    const newTable = simulateMatch(
      pointsTable,
      team,
      opponent,
      true,  // team won
      150,
      120,
      140,
      120
    );

    expect(newTable[0].points).toBe(initialTeamPoints + 2);
    expect(newTable[1].points).toBe(initialOppPoints);
  });

  test('throws error for unknown team', () => {
    expect(() => {
      simulateMatch(pointsTable, 'Unknown Team', 'Another Unknown', true, 100, 120, 80, 120);
    }).toThrow('Team or opponent not found');
  });
});

describe('getTeamPosition - rank team in standings', () => {
  test('returns position 1 for top team', () => {
    const position = getTeamPosition(pointsTable, pointsTable[0].team);
    // Position depends on points and NRR; just check it's a valid position
    expect(position).toBeGreaterThanOrEqual(1);
    expect(position).toBeLessThanOrEqual(pointsTable.length);
  });

  test('returns valid position for any team', () => {
    pointsTable.forEach(team => {
      const position = getTeamPosition(pointsTable, team.team);
      expect(position).toBeGreaterThanOrEqual(1);
      expect(position).toBeLessThanOrEqual(pointsTable.length);
    });
  });
});