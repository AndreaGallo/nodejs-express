/* eslint-disable no-throw-literal */
const jwt = require('jsonwebtoken');

const isValidHostname = (req, res, next) => {
  const validHostnames = ['localhost', 'andrea.com'];
  if (validHostnames.includes(req.hostname)) {
    next();
  } else {
    res.status(403).send({ status: 'ACCESS_DENIED' });
  }
};

const isAuth = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (token) {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.sessionData = { userId: data.userId, role: data.role };
      next();
    } else {
      throw {
        code: 403,
        status: 'ACCESS_DENIED',
        message: 'Missing header token',
      };
    }
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ status: error.status || 'ERROR', message: error.message });
  }
};

const isAdmin = (req, res, next) => {
  try {
    const { role } = req.sessionData;
    if (role !== 'admin') {
      throw {
        code: 403,
        status: 'ACCESS_DENIED',
        message: 'Invalid role',
      };
    }
    next();
  } catch (error) {
    res
      .status(error.code || 500)
      .send({ status: error.status || 'ERROR', message: error.message });
  }
};

module.exports = {
  isValidHostname,
  isAuth,
  isAdmin,
};
