const mongoose = require('mongoose');
const {
  maxClassroom, maxDay, maxCredit, minutePerCredit, maxMinute,
} = require('../../libs/constraint');
const { enumValues } = require('../../libs/constant');

const semester = {
  number: { type: Number, min: 1, max: 2 },
  year: { type: Number, min: 0 },
};

const schedule = {
  day: { type: Number, min: 1, max: maxDay },
  allocatedCredit: { type: Number, min: 1 },
  allocatedMinute: { type: Number, min: minutePerCredit },
};

const studySchema = mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  classroom: { type: Number, min: 1, max: maxClassroom },
  semester,
  schedule: [schedule],
  totalAllocatedCredit: { type: Number, min: 1, max: maxCredit },
  totalAllocatedMinute: { type: Number, min: minutePerCredit, max: maxMinute },
  subject: { type: String, enum: enumValues.subject },
});

module.exports = mongoose.model('Study', studySchema);
