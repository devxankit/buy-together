const httpStatus = require('http-status');
const authService = require('../services/auth.service');

const register = async (req, res) => {
  const user = await authService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await authService.generateAuthTokens(user);
  res.send({ user, tokens });
};

const logout = async (req, res) => {
  await authService.logout(req.body.refreshToken); // Placeholder
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  register,
  login,
  logout,
};
