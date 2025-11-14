// Integration test for calculatePerformanceRange exported by utils
// Requires: jest installed as devDependency

const { calculatePerformanceRange } = require('../src/utils/iplCalculations');
const pointsTable = require('../src/data/pointsTable.json');

describe('calculatePerformanceRange', () => {
    test('returns expected fields for batting input', async () => {
        const input = {
            team: pointsTable[0].team,
            opponent: pointsTable[1].team,
            overs: 20,
            runs: 150,
            toss: 'bat',
            desiredPosition: 2
        };

        const res = await calculatePerformanceRange(input, pointsTable);
        expect(res).toBeTruthy();
        expect(res).toHaveProperty('minRestrictRuns');
        expect(res).toHaveProperty('maxRestrictRuns');
        expect(res).toHaveProperty('revisedNRRMin');
        expect(res).toHaveProperty('revisedNRRMax');
    }, 20000);
});
