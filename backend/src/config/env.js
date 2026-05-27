require('dotenv').config();
const joi = require('joi');

const envVarsSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().default(5000),
  MONGODB_URI: joi.string().required().description('MongoDB connection URI'),

  // Auth
  JWT_SECRET: joi.string().required().description('JWT secret key'),
  JWT_EXPIRE: joi.string().default('30d').description('JWT expiry (e.g. 30d, 24h)'),

  // OTP
  OTP_LENGTH: joi.number().integer().min(4).max(8).default(6),
  OTP_EXPIRY_MINUTES: joi.number().integer().min(1).default(5),
  OTP_MAX_ATTEMPTS: joi.number().integer().min(1).default(5),
  OTP_RESEND_COOLDOWN_SECONDS: joi.number().integer().min(0).default(30),
  // First variable in the DLT template (the "##var##" before "powered by…").
  OTP_BRAND_NAME: joi.string().default('Buy Together'),
  // Must match the registered DLT content template exactly (punctuation included).
  // {brand} -> OTP_BRAND_NAME, {otp} -> the generated code.
  OTP_SMS_TEMPLATE: joi
    .string()
    .default('Welcome to the {brand} powered by SMSINDIAHUB. Your OTP for registration is {otp}'),
  DEFAULT_TEST_PHONE: joi.string().allow('').default(''),
  DEFAULT_TEST_OTP: joi.string().allow('').default(''),

  // SMS India Hub (legacy pushsms.aspx HTTP API)
  // Master switch: true => send real SMS; false => print OTP to the terminal.
  SMS_INDIA_ENABLED: joi.boolean().default(false),
  SMS_INDIA_BASE_URL: joi.string().default('http://cloud.smsindiahub.in/vendorsms/pushsms.aspx'),
  SMS_INDIA_HUB_USERNAME: joi.string().allow('').default(''),
  SMS_INDIA_HUB_API_KEY: joi.string().allow('').default(''),
  SMS_INDIA_HUB_SENDER_ID: joi.string().allow('').default(''),
  SMS_INDIA_HUB_DLT_TEMPLATE_ID: joi.string().allow('').default(''),
  SMS_INDIA_HUB_GWID: joi.number().integer().default(2),
  SMS_INDIA_HUB_ENTITY_ID: joi.string().allow('').default(''),

  // Admin seed (used by `npm run seed:admin`)
  ADMIN_NAME: joi.string().default('Super Admin'),
  ADMIN_EMAIL: joi.string().email({ tlds: false }).allow('').default(''),
  ADMIN_PHONE: joi.string().allow('').default(''),
  ADMIN_PASSWORD: joi.string().allow('').default(''),

  // Integrations (existing placeholders)
  FIREBASE_KEY: joi.string().allow('').optional(),
  MAPS_API_KEY: joi.string().allow('').optional(),
  PAYMENT_GATEWAY_KEY: joi.string().allow('').optional(),
}).unknown().required();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URI,
    options: {},
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRE,
  },
  otp: {
    length: envVars.OTP_LENGTH,
    expiryMinutes: envVars.OTP_EXPIRY_MINUTES,
    maxAttempts: envVars.OTP_MAX_ATTEMPTS,
    resendCooldownSeconds: envVars.OTP_RESEND_COOLDOWN_SECONDS,
    brandName: envVars.OTP_BRAND_NAME,
    smsTemplate: envVars.OTP_SMS_TEMPLATE,
    testPhone: envVars.DEFAULT_TEST_PHONE,
    testOtp: envVars.DEFAULT_TEST_OTP,
  },
  sms: {
    enabled: envVars.SMS_INDIA_ENABLED,
    baseUrl: envVars.SMS_INDIA_BASE_URL,
    username: envVars.SMS_INDIA_HUB_USERNAME,
    apiKey: envVars.SMS_INDIA_HUB_API_KEY,
    senderId: envVars.SMS_INDIA_HUB_SENDER_ID,
    dltTemplateId: envVars.SMS_INDIA_HUB_DLT_TEMPLATE_ID,
    gwid: envVars.SMS_INDIA_HUB_GWID,
    entityId: envVars.SMS_INDIA_HUB_ENTITY_ID,
  },
  admin: {
    name: envVars.ADMIN_NAME,
    email: envVars.ADMIN_EMAIL,
    phone: envVars.ADMIN_PHONE,
    password: envVars.ADMIN_PASSWORD,
  },
};
