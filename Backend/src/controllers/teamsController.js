const teams = require('../data/teams.json');

exports.getTeams = (req, res) => {
  
  res.json(teams);
};
