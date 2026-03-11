const validate = (rules) => (req, res, next) => {
  const errors = [];
  rules.forEach(({ field, required, type, min, max, label }) => {
    const value = req.body[field];
    const name = label || field;
    if (required && (value === undefined || value === null || value === "")) {
      errors.push(`${name} is required`);
      return;
    }
    if (value !== undefined && value !== "" && value !== null) {
      if (type === "number") {
        const num = Number(value);
        if (isNaN(num)) errors.push(`${name} must be a number`);
        else {
          if (min !== undefined && num < min) errors.push(`${name} must be at least ${min}`);
          if (max !== undefined && num > max) errors.push(`${name} must be at most ${max}`);
        }
      }
      if (type === "datetime") {
        const d = new Date(value);
        if (isNaN(d.getTime())) errors.push(`${name} must be a valid datetime`);
      }
    }
  });
  if (errors.length > 0) return res.status(400).json({ errors });
  next();
};

module.exports = validate;
