const mongoose = require('mongoose');

async function getDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/library', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to Local MongoDB');
  } catch (err) {
    console.error('❌ Local MongoDB Connection Error:', err.message);
  }
}

module.exports = { getDatabase };
