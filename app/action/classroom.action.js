const Study = require('../db/models/study');
const { maxStudentPerClassroom } = require('../libs/constraint');

const checkAvailability = async ({ studentId, semester, day, classroom }) => {
  try {
    const data = await Study.countDocuments({
      studentId: {
        $ne: studentId,
      },
      semester,
      'schedule.day': day,
      'schedule.classroom': classroom,
    });

    if (data >= maxStudentPerClassroom) {
      throw new Error(`The number of student in classroom ${classroom} for semester ${semester.number}, year ${semester.year}, day ${day} has reached the maximum number of student per classroom (${maxStudentPerClassroom})`);
    }

    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  checkAvailability,
};
