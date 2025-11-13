// Integration tests for backend API endpoints
// Requires: jest & supertest installed as devDependencies

const request = require('supertest');
const app = require('../app');
const pointsTable = require('../data/pointsTable.json');

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
            team: pointsTable[0].team,
            opponent: pointsTable[1].team,
            overs: 20,
            runs: 150,
            toss: 'bat',
            desiredPosition: 2
        };

        const res = await request(app).post('/api/calculate').send(payload);
        // calculation may take time; accept 200 or 201
        expect([200, 201]).toContain(res.statusCode);
        expect(res.body).toHaveProperty('calculationResult');
        expect(res.body).toHaveProperty('performanceRange');
        expect(res.body.performanceRange).toHaveProperty('minRestrictRuns');
        expect(res.body.performanceRange).toHaveProperty('maxRestrictRuns');
    }, 20000);
});
