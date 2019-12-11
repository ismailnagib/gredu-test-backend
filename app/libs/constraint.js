const isNil = require('lodash/isNil');

const defaultMaxClassroom = 8;
const maxClassroom = !isNil(process.env.MAX_CLASSROOM) && process.env.MAX_CLASSROOM >= 1
  ? process.env.MAX_CLASSROOM * 1
  : defaultMaxClassroom;

const defaultMaxStudentPerClassroom = 20;
const maxStudentPerClassroom = !isNil(process.env.MAX_STUDENT_PER_CLASSROOM)
  && process.env.MAX_STUDENT_PER_CLASSROOM >= 0
  ? process.env.MAX_STUDENT_PER_CLASSROOM * 1
  : defaultMaxStudentPerClassroom;

const defaultMaxDay = 6;
const maxDay = !isNil(process.env.MAX_DAY) && process.env.MAX_DAY >= 1
  ? process.env.MAX_DAY * 1
  : defaultMaxDay;

const defaultMaxCredit = 20;
const maxCredit = !isNil(process.env.MAX_CREDIT) && process.env.MAX_CREDIT >= 1
  ? process.env.MAX_CREDIT * 1
  : defaultMaxCredit;

const defaultMinutePerCredit = 45;
const minutePerCredit = !isNil(process.env.MINUTE_PER_CREDIT) && process.env.MINUTE_PER_CREDIT >= 1
  ? process.env.MINUTE_PER_CREDIT * 1
  : defaultMinutePerCredit;

const defaultMaxMinute = 2400;
const maxMinute = !isNil(process.env.MAX_MINUTE) && process.env.MAX_MINUTE >= minutePerCredit
  ? process.env.MAX_MINUTE * 1
  : defaultMaxMinute;

module.exports = {
  maxClassroom,
  maxStudentPerClassroom,
  maxDay,
  maxCredit,
  minutePerCredit,
  maxMinute,
};
