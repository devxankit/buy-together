const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../src/config/db');
const userService = require('../src/services/user.service');
const User = require('../src/models/User');

const run = async () => {
  console.log('Connecting to database...');
  await connectDB();
  
  console.log('Fetching a user...');
  const user = await User.findOne();
  if (!user) {
    console.log('No user found in database. Seeding might be needed.');
    await mongoose.disconnect();
    return;
  }
  
  console.log(`Found user: ${user.name} (${user.id})`);
  console.log('Fetching stats...');
  const stats = await userService.getUserStats(user.id);
  console.log('User stats calculated:', stats);
  
  await mongoose.disconnect();
  console.log('Database disconnected.');
};

run().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
