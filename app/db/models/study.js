const mongoose = require('mongoose');
const {
  maxClassroom, maxDay, maxCredit, minutePerCredit, maxMinute,
} = require('../../libs/constraint');

const semester = {
  number: { type: Number, min: 1, max: 2 },
  year: { type: Number, min: 0 },
};

const schedule = {
  day: { type: Number, min: 1, max: maxDay },
  allocatedCredit: { type: Number, min: 1 },
  allocatedMinute: { type: Number, min: minutePerCredit },
  classroom: { type: Number, min: 1, max: maxClassroom },
  subjectId: { type: mongoose.Schema.Types.ObjectId },
};

const studySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId },
  semester,
  schedules: [schedule],
  totalAllocatedCredit: { type: Number, min: 1, max: maxCredit },
  totalAllocatedMinute: { type: Number, min: minutePerCredit, max: maxMinute },
}, {
  id: false,
  toJSON: {
    virtuals: true,
  },
});

studySchema.virtual('student', {
  ref: 'Student',
  localField: 'studentId',
  foreignField: '_id',
  justOne: true,
});

studySchema.virtual('subject', {
  ref: 'Subject',
  localField: 'subjectId',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('Study', studySchema);
