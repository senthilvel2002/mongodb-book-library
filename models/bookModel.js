const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  email: String,
  story: String,
  isbn: String,
  description: String
});

// Prevent OverwriteModelError
module.exports = mongoose.models.Book || mongoose.model('Book', bookSchema);