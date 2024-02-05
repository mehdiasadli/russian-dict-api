const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error: ', error);
  }
}

module.exports = connect;
