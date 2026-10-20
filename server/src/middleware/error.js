exports.notFound = (req, res) =>
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res
      .status(400)
      .json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};