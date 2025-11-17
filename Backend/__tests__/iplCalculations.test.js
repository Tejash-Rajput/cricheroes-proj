// Integration test for getPerformanceRange exported by utils
// Requires: jest installed as devDependency

const { getPerformanceRange } = require('../src/utils/iplCalculations');
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
        // adapt to current schema: names are 'name' in pointsTable
        const body = {
            team: pointsTable[0].name,
            opponent: pointsTable[1].name,
            overs: 20,
            runs: 150,
            toss: 'bat',
            desiredPosition: 2,
        };

        const res = await getPerformanceRange(body, pointsTable);
        expect(res).toBeTruthy();
        // For batting restriction the util returns restrictionMin/restrictionMax and nrrBest/nrrWorst
        expect(res).toHaveProperty('restrictionMin');
        expect(res).toHaveProperty('restrictionMax');
        expect(res).toHaveProperty('nrrBest');
        expect(res).toHaveProperty('nrrWorst');
    }, 20000);
});
