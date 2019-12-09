const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  name: { type: String, default: '' },
});

module.exports = mongoose.model('Student', studentSchema);
