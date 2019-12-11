const mongoose = require('mongoose');
const { enumValues } = require('../../libs/constant');
const { maxClassroom, maxDay, maxCredit } = require('../../libs/constraint');

const semester = {
  number: { type: Number, min: 1, max: 2 },
  year: { type: Number, min: 0 },
};

const schedule = new mongoose.Schema({
  semester,
  program: { type: String, enum: enumValues.program },
  subjectId: { type: mongoose.Schema.Types.ObjectId },
  classroom: { type: Number, min: 1, max: maxClassroom },
  day: { type: Number, min: 1, max: maxDay },
  credit: { type: Number, min: 1, max: maxCredit },
}, {
  id: false,
  toJSON: {
    virtuals: true,
  },
});

schedule.virtual('subject', {
  ref: 'Subject',
  localField: 'subjectId',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('schedule', schedule);
