const mongoose = require('mongoose');
const { enumValues } = require('../../libs/constant');

const studentSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  program: { type: String, enum: enumValues.program },
});

module.exports = mongoose.model('Student', studentSchema);
