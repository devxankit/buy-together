const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

const createUser = async (userBody) => {
  if (await User.findOne({ email: userBody.email })) {
    throw new Error('Email already taken');
  }
  return User.create(userBody);
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new Error('Incorrect email or password');
  }
  return user;
};

const generateAuthTokens = async (user) => {
  const payload = {
    sub: user.id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24h
  };
  return jwt.sign(payload, config.jwt.secret);
};

const logout = async (refreshToken) => {
  // Logic for revoking refresh token
  return;
};

module.exports = {
  createUser,
  loginUserWithEmailAndPassword,
  generateAuthTokens,
  logout,
};
