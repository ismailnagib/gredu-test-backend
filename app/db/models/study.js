const mongoose = require('mongoose');
const { enumValues } = require('../../libs/constant');

const defaultMaxClassroom = 8;
const maxClassroom = process.env.MAX_CLASSROOM !== null && process.env.MAX_CLASSROOM > 1
  ? process.env.MAX_CLASSROOM
  : defaultMaxClassroom;

const defaultMaxDay = 6;
const maxDay = process.env.MAX_DAY !== null && process.env.MAX_DAY > 1
  ? process.env.MAX_DAY
  : defaultMaxDay;

const defaultMaxCredit = 20;
const maxCredit = process.env.MAX_CREDIT !== null && process.env.MAX_CREDIT > 1
  ? process.env.MAX_CREDIT
  : defaultMaxCredit;

const defaultMinutePerCredit = 45;
const minutePerCredit = process.env.MINUTE_PER_CREDIT !== null && process.env.MINUTE_PER_CREDIT > 1
  ? process.env.MINUTE_PER_CREDIT
  : defaultMinutePerCredit;

const defaultMaxMinute = 2400;
const maxMinute = process.env.MAX_MINUTE !== null && process.env.MAX_MINUTE >= minutePerCredit
  ? process.env.MAX_MINUTE
  : defaultMaxMinute;

const semester = {
  number: { type: Number, min: 1, max: 2 },
  year: { type: Number, min: 1 },
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
