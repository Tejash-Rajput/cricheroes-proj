const Joi = require('joi');

// Validation schema for calculate endpoint
const calculateSchema = Joi.object({
  team: Joi.string().required().messages({
    'any.required': 'Team is required',
    'string.empty': 'Team cannot be empty',
  }),
  opponent: Joi.string().required().messages({
    'any.required': 'Opponent is required',
    'string.empty': 'Opponent cannot be empty',
  }),
  overs: Joi.string().pattern(/^\d+$/).required().messages({
    'any.required': 'Overs is required',
    'string.pattern.base': 'Overs must be a numeric string',
  }),
  runs: Joi.number().integer().required().messages({
    'any.required': 'Runs is required',
    'number.base': 'Runs must be a number',
  }),
  toss: Joi.string().valid('bat', 'bowl').required().messages({
    'any.required': 'Toss is required',
    'any.only': 'Toss must be either "bat" or "bowl"',
  }),
  desiredPosition: Joi.number().integer().min(1).required().messages({
    'any.required': 'Desired position is required',
    'number.base': 'Desired position must be a number',
    'number.min': 'Desired position must be at least 1',
  }),
});

// Middleware to validate request body
const validateCalculateRequest = (req, res, next) => {
  const { error, value } = calculateSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: messages,
    });
  }

  req.cleanedBody = value;
  next();
};

module.exports = { validateCalculateRequest, calculateSchema };
