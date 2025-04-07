const jwt = require('jsonwebtoken');

const auth = (req) => {
  const token = req.headers.authorization || '';
  if (!token) return { user: null };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch (err) {
    return { user: null };
  }
};

module.exports = auth;
