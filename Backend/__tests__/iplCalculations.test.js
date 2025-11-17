// Integration test for getPerformanceRange exported by utils
// Requires: jest installed as devDependency

const { getPerformanceRange } = require('../src/utils/iplCalculations');
const pointsTable = require('../src/data/pointsTable.json');

describe('calculatePerformanceRange', () => {
    test('returns expected fields for batting input', async () => {
        const input = {
            team: pointsTable[3].name,
            opponent: pointsTable[2].name,
            overs: '20',
            runs: 120,
            toss: 'bat',
            desiredPosition: 3,
        };
        // adapt to current schema: names are 'name' in pointsTable
        const body = {
            team: pointsTable[3].name,
            opponent: pointsTable[2].name,
            overs: '20',
            runs: 120,
            toss: 'bat',
            desiredPosition: 3,
        };

        const res = await getPerformanceRange(body, pointsTable);
        expect(res).toBeTruthy();
        // For batting restriction the util returns restrictionMin/restrictionMax and nrrBest/nrrWorst
        expect(res).toHaveProperty('restrictionMin');
        expect(res).toHaveProperty('restrictionMax');
        expect(res).toHaveProperty('nrrBest');
        expect(res).toHaveProperty('nrrWorst');

        // Print a concise calculated answer string for assignment validation
        const out = `RESTRICTION ${body.team} vs ${body.opponent} runs=${body.runs} overs=${body.overs} -> min=${res.restrictionMin} max=${res.restrictionMax} nrrBest=${res.nrrBest} nrrWorst=${res.nrrWorst}`;
        // eslint-disable-next-line no-console
        console.log(out);
    }, 20000);
    
        test('1b: Delhi Capitals bat first 119 in 20 overs -> Rajasthan chase overs', async () => {
            const body = {
                team: pointsTable[3].name, // Rajasthan Royals
                opponent: pointsTable[2].name, // Delhi Capitals
                overs: '20',
                runs: 119,
                toss: 'bowl', // opponent batted first
                desiredPosition: 3,
            };

            const res = await getPerformanceRange(body, pointsTable);
            expect(res).toBeTruthy();
            // chase response includes chaseTarget/minOvers/maxOvers
            expect(res).toHaveProperty('chaseTarget');
            expect(res).toHaveProperty('minOvers');
            expect(res).toHaveProperty('maxOvers');
            const out = `CHASE ${body.team} vs ${body.opponent} runs=${body.runs} overs=${body.overs} -> chaseTarget=${res.chaseTarget} minOvers=${res.minOvers} maxOvers=${res.maxOvers} nrrBest=${res.nrrBest} nrrWorst=${res.nrrWorst}`;
            // eslint-disable-next-line no-console
            console.log(out);
        }, 20000);

        test('2c: Rajasthan bat first 80 in 20 overs -> restrict RCB (range)', async () => {
            const body = {
                team: pointsTable[3].name, // Rajasthan Royals
                opponent: pointsTable[1].name, // Royal Challengers Bangalore
                overs: '20',
                runs: 80,
                toss: 'bat',
                desiredPosition: 3,
            };
            const res = await getPerformanceRange(body, pointsTable);
            expect(res).toBeTruthy();
            expect(res).toHaveProperty('restrictionMin');
            expect(res).toHaveProperty('restrictionMax');
            const out = `RESTRICTION ${body.team} vs ${body.opponent} runs=${body.runs} overs=${body.overs} -> min=${res.restrictionMin} max=${res.restrictionMax} nrrBest=${res.nrrBest} nrrWorst=${res.nrrWorst}`;
            // eslint-disable-next-line no-console
            console.log(out);
        }, 20000);

        test('2d: RCB bat first 79 in 20 overs -> Rajasthan chase overs (range)', async () => {
            const body = {
                team: pointsTable[3].name, // Rajasthan Royals
                opponent: pointsTable[1].name, // Royal Challengers Bangalore
                overs: '20',
                runs: 79,
                toss: 'bowl',
                desiredPosition: 3,
            };
            const res = await getPerformanceRange(body, pointsTable);
            expect(res).toBeTruthy();
            expect(res).toHaveProperty('chaseTarget');
            expect(res).toHaveProperty('minOvers');
            expect(res).toHaveProperty('maxOvers');
            const out = `CHASE ${body.team} vs ${body.opponent} runs=${body.runs} overs=${body.overs} -> chaseTarget=${res.chaseTarget} minOvers=${res.minOvers} maxOvers=${res.maxOvers} nrrBest=${res.nrrBest} nrrWorst=${res.nrrWorst}`;
            // eslint-disable-next-line no-console
            console.log(out);
        }, 20000);
});
