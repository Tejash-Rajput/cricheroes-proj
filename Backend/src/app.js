const express = require('express');
const cors = require('cors');

const calculateRoutes = require('./routes/calculateRoutes.js');
const teamsRoutes = require('./routes/teamsRoutes.js');
const pointsTableRoutes = require('./routes/pointsTableRoutes.js');
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/calculate', calculateRoutes);
app.use('/api/points-table', pointsTableRoutes);
app.use('/api/teams', teamsRoutes);

app.get('/', (req, res) => {
  res.send('IPL Points Table API Running');
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
