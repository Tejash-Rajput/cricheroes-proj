function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const err = new Error('Validation failed');
      err.status = 400;
      err.details = error.details;
      return next(err);
    }
    req.body = value;
    return next();
  };
}
module.exports = { validateBody };
