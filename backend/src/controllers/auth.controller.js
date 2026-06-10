const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
const { OTP_PURPOSE } = require('../utils/constants');

// Attach the dev OTP to the response only when not in live mode, so the
// frontend/tester can read it without an SMS gateway.
const withDevOtp = (payload, devOtp) => (devOtp ? { ...payload, devOtp } : payload);

/**
 * POST /auth/login  — request an OTP for an existing/new mobile (login flow).
 * Body: { phone }
 */
const login = catchAsync(async (req, res) => {
  const { phone, isNewUser, devOtp } = await authService.requestLoginOtp(req.body.phone);
  res.send(
    withDevOtp(
      { message: 'OTP sent successfully', phone, isNewUser },
      devOtp
    )
  );
});

/** Alias of login for clients that call /auth/send-otp. */
const sendOtp = login;

/**
 * POST /auth/register — start signup; stores profile + sends OTP.
 * Body: { name, email?, phone }
 */
const register = catchAsync(async (req, res) => {
  const { phone, devOtp } = await authService.requestSignupOtp(req.body);
  res.status(httpStatus.CREATED).send(
    withDevOtp({ message: 'OTP sent successfully', phone }, devOtp)
  );
});

/**
 * POST /auth/verify-otp — verify code and return an authenticated session.
 * Body: { phone, otp, name?, email? }  ->  { user, token }
 */
const verifyOtp = catchAsync(async (req, res) => {
  const { user, token } = await authService.verifyOtpAndAuth(req.body);
  res.send({ user, token });
});

/**
 * POST /auth/resend-otp — re-issue an OTP.
 * Body: { phone, purpose? }
 */
const resendOtp = catchAsync(async (req, res) => {
  const { phone, devOtp } = await authService.resendOtp(
    req.body.phone,
    req.body.purpose || OTP_PURPOSE.LOGIN
  );
  res.send(withDevOtp({ message: 'OTP resent successfully', phone }, devOtp));
});

/**
 * POST /auth/admin/login — admin console email + password login.
 * Body: { email, password }  ->  { user, token }
 */
const adminLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginAdminWithEmailAndPassword(email, password);
  res.send({ user, token });
});

/** POST /auth/logout — stateless JWT; client simply drops the token. */
const logout = catchAsync(async (req, res) => {
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  login,
  sendOtp,
  register,
  verifyOtp,
  resendOtp,
  adminLogin,
  logout,
};
