const mongoose = require('mongoose');
const config = require('../src/config/env');
const otpService = require('../src/services/otp.service');
const bcrypt = require('bcryptjs');

const run = async () => {
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  console.log('Connected');
  
  const testPhone = '9999999991';
  try {
    const res = await otpService.sendOtp(testPhone, 'signup');
    console.log('Result from sendOtp:', res);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    const Otp = require('../src/models/Otp');
    await Otp.deleteMany({ phone: testPhone });
    await mongoose.disconnect();
  }
};

run().catch(console.error);
