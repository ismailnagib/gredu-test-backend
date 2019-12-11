const mongoose = require('mongoose');
const { enumValues } = require('../../libs/constant');

const schedule = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Schedule',
};

const studentSchema = new mongoose.Schema({
  name: { type: String },
  program: { type: String, enum: enumValues.program },
  schedules: [schedule],
});

module.exports = mongoose.model('Student', studentSchema);
