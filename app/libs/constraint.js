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

module.exports = {
  maxClassroom,
  maxDay,
  maxCredit,
  minutePerCredit,
  maxMinute,
};
