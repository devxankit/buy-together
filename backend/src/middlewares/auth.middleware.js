const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/env');
const { User } = require('../models/User'); // Will create this later

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    // Note: We can add a User check here once the model is implemented
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).send({ message: 'Invalid token' });
  }
};

module.exports = auth;
