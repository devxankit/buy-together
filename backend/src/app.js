const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const httpStatus = require('http-status').status;
const config = require('./config/env');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Behind Hostinger's nginx reverse proxy, the client IP is in X-Forwarded-For.
// Trust the first proxy hop so `req.ip` (used for rate limiting) is the real
// client address, not the proxy's. `1` = trust exactly one upstream proxy.
app.set('trust proxy', 1);

// Request logging only in development — morgan on every request adds avoidable
// overhead (and log noise) in production.
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// set security HTTP headers
app.use(helmet());

// gzip all responses — shrinks JSON payloads (and the SPA assets if served
// from here) by ~70%, the single biggest win for perceived response speed.
app.use(compression());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors. `maxAge` lets the browser cache the preflight (OPTIONS) result
// for 24h, so repeat cross-origin calls skip the extra preflight round trip
// that was doubling every request.
const corsOptions = { maxAge: 86400 };
app.use(cors(corsOptions));
app.options('*any', cors(corsOptions));

// api routes
app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new Error(`Not found - ${req.originalUrl}`));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
