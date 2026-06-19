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

// enable cors
app.use(cors());
app.options('*any', cors());

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
