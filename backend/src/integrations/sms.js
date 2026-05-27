const config = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status').status;

/**
 * SMS gateway adapter — SMS India Hub (legacy pushsms.aspx HTTP API).
 *
 * Behaviour is gated by SMS_INDIA_ENABLED:
 *   - false (default): nothing is sent; the message is printed to the server
 *     terminal so you can read the OTP during development/testing.
 *   - true: the message is delivered through SMS India Hub.
 *
 * Numbers are normalised to "91XXXXXXXXXX" (India) before sending.
 */

const withCountryCode = (phone) => {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
};

const sendViaSmsIndiaHub = async (phone, message) => {
  const { baseUrl, username, apiKey, senderId, dltTemplateId, gwid, entityId } = config.sms;

  if (!apiKey || !senderId) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'SMS India Hub is not configured (missing API key or sender id)'
    );
  }

  // pushsms.aspx parameters: APIKey + msisdn + sid + msg + fl/dc; DLT template/entity id and gwid when set.
  const params = new URLSearchParams({
    APIKey: apiKey,
    msisdn: withCountryCode(phone),
    sid: senderId,
    msg: message,
    fl: '0',
    dc: '0',
    gwid: String(gwid || 2),
  });
  if (username) params.set('user', username);
  
  if (dltTemplateId) {
    params.set('DLTTemplateId', dltTemplateId);
    params.set('templateid', dltTemplateId);
    params.set('dlttemplateid', dltTemplateId);
  }
  if (entityId) {
    params.set('entityid', entityId);
  }

  const url = `${baseUrl}?${params.toString()}`;

  let res;
  try {
    res = await fetch(url, { method: 'GET' });
  } catch (err) {
    logger.error(`SMS India Hub request failed: ${err.message}`);
    throw new ApiError(httpStatus.BAD_GATEWAY, 'Failed to reach SMS provider');
  }

  const bodyText = (await res.text()).trim();
  if (!res.ok) {
    logger.error(`SMS India Hub HTTP ${res.status}: ${bodyText}`);
    throw new ApiError(httpStatus.BAD_GATEWAY, 'SMS provider rejected the request');
  }

  // Response may be JSON ({ ErrorCode, ErrorMessage, ... }) or plain text.
  try {
    const data = JSON.parse(bodyText);
    const code = String(data.ErrorCode ?? data.errorCode ?? '0');
    if (code !== '000' && code !== '0') {
      logger.error(`SMS India Hub error ${code}: ${data.ErrorMessage || bodyText}`);
      throw new ApiError(httpStatus.BAD_GATEWAY, data.ErrorMessage || 'SMS could not be sent');
    }
    logger.info(
      `SMS India Hub accepted message for ${withCountryCode(phone)} — response: ${bodyText}`
    );
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Non-JSON body. pushsms.aspx returns text on error too — flag obvious failures.
    if (/error|invalid|fail|denied/i.test(bodyText)) {
      logger.error(`SMS India Hub error: ${bodyText}`);
      throw new ApiError(httpStatus.BAD_GATEWAY, `SMS provider error: ${bodyText}`);
    }
    logger.info(`SMS India Hub response for ${withCountryCode(phone)}: ${bodyText}`);
    return { raw: bodyText };
  }
};

/**
 * Send an SMS. Returns metadata about the send.
 * When SMS_INDIA_ENABLED=false it logs the message and resolves without
 * contacting any gateway.
 */
const sendSms = async (phone, message) => {
  if (!config.sms.enabled) {
    logger.info('──────────── DEV SMS (SMS_INDIA_ENABLED=false) ────────────');
    logger.info(`To   : ${withCountryCode(phone)}`);
    logger.info(`Text : ${message}`);
    logger.info('───────────────────────────────────────────────────────────');
    return { delivered: false, devMode: true };
  }

  const result = await sendViaSmsIndiaHub(phone, message);
  return { delivered: true, devMode: false, provider: 'smsindiahub', result };
};

module.exports = {
  sendSms,
  withCountryCode,
};
