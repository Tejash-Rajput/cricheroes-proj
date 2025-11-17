// Integration tests for backend API endpoints
// Requires: jest & supertest installed as devDependencies

const request = require('supertest');
const app = require('../src/app');
const pointsTable = require('../src/data/pointsTable.json');

describe('Backend API - basic endpoints and validation', () => {
    test('GET / returns welcome text', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/IPL Points Table API Running/i);
    });

    test('GET /api/points-table returns JSON array', async () => {
        const res = await request(app).get('/api/points-table');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /api/teams returns JSON array', async () => {
        const res = await request(app).get('/api/teams');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/calculate with missing fields returns 400', async () => {
        const res = await request(app).post('/api/calculate').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('POST /api/calculate with valid payload returns calculation shape', async () => {
        // Use two known teams from data/pointsTable.json
        const payload = {
            team: pointsTable[3].name,
            opponent: pointsTable[2].name,
            overs: '20',
            runs: 120,
            toss: 'bat',
            desiredPosition: 3,
        };

        const res = await request(app).post('/api/calculate').send(payload);
        // calculation may take time; accept 200 or 201
        expect([200, 201]).toContain(res.statusCode);
                // current controller returns 'perfOutcome' and 'summary'
                expect(res.body).toHaveProperty('perfOutcome');
                expect(res.body).toHaveProperty('summary');
                // for batting case perfOutcome should include restrictionMin/restrictionMax
                expect(res.body.perfOutcome).toHaveProperty('restrictionMin');
                expect(res.body.perfOutcome).toHaveProperty('restrictionMax');

                // Print a concise calculated answer string for assignment validation
                const p = res.body.perfOutcome;
                if (p.restrictionMin !== undefined) {
                    const str = `RESTRICTION ${payload.team} vs ${payload.opponent} runs=${payload.runs} overs=${payload.overs} -> min=${p.restrictionMin} max=${p.restrictionMax} nrrBest=${p.nrrBest} nrrWorst=${p.nrrWorst}`;
                    // eslint-disable-next-line no-console
                    console.log(str);
                } else {
                    const str = `CHASE ${payload.team} vs ${payload.opponent} runs=${payload.runs} overs=${payload.overs} -> chaseTarget=${p.chaseTarget} minOvers=${p.minOvers} maxOvers=${p.maxOvers} nrrBest=${p.nrrBest} nrrWorst=${p.nrrWorst}`;
                    // eslint-disable-next-line no-console
                    console.log(str);
                }
    }, 20000);
});
