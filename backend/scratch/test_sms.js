const config = require('../src/config/env');
const { sendSms } = require('../src/integrations/sms');

async function test() {
  console.log('Testing SMS configuration with forced enabled:');
  config.sms.enabled = true; // force enabled for testing error propagation

  const testNumber = '9876543210'; 
  const message = 'Welcome to the Buy Together powered by SMSINDIAHUB. Your OTP for registration is 123456';

  try {
    const response = await sendSms(testNumber, message);
    console.log('SUCCESS Response:', response);
  } catch (error) {
    console.error('ERROR Sending SMS:', error.toString());
  }
}

test();
