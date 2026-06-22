const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../src/config/db');
const userController = require('../src/controllers/user.controller');
const User = require('../src/models/User');

const run = async () => {
  console.log('Connecting to database...');
  await connectDB();
  
  console.log('Fetching a user...');
  const user = await User.findOne();
  if (!user) {
    console.log('No user found in database.');
    await mongoose.disconnect();
    return;
  }
  
  console.log(`Testing getProfile for user: ${user.name} (${user.id})`);
  const req = {
    user: {
      id: user.id
    }
  };
  
  const res = {
    send: (data) => {
      console.log('Controller response received:');
      console.log(JSON.stringify(data, null, 2));
    },
    status: (code) => {
      console.log(`Status set to: ${code}`);
      return res;
    }
  };
  
  await userController.getProfile(req, res);
  
  await mongoose.disconnect();
  console.log('Database disconnected.');
};

run().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
