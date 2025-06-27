require('dotenv').config();
const mongoose = require('mongoose');

async function getDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB Atlas Connection Error:', err.message);
  }
}

module.exports = { getDatabase };
