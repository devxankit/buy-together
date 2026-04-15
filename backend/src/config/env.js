require('dotenv').config();
const joi = require('joi');

const envVarsSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().default(5000),
  MONGODB_URI: joi.string().required().description('MongoDB connection URI'),
  JWT_SECRET: joi.string().required().description('JWT secret key'),
  JWT_EXPIRE: joi.string().default('30d'),
  REDIS_HOST: joi.string().default('127.0.0.1'),
  REDIS_PORT: joi.number().default(6379),
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
    options: {
      // mongoose 6+ doesn't need these but keeping for compatibility if needed
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_EXPIRE,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
  }
};
