const joi = require('@hapi/joi');
const studentAction = require('../action/student.action');
const scheduleAction = require('../action/schedule.action');
const normalizeError = require('../helpers/normalizeError');
const { httpStatus, enumValues } = require('../libs/constant');
const {
  maxCredit, minutePerCredit, maxMinute, maxStudentPerClassroom,
} = require('../libs/constraint');

const getAllStudent = async (req, res) => {
  try {
    const data = await studentAction.getStudent();

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const getOneStudent = async (req, res) => {
  try {
    const data = await studentAction.getStudentById(req.params.id);

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const createStudent = async (req, res) => {
  try {
    const validator = joi.object({
      name: joi.string().required(),
      program: joi.string().valid(...enumValues.program).required(),
    });

    const { error } = validator.validate(req.body);

    if (error) {
      const validationError = normalizeError(error);
      return res.status(httpStatus.badRequest).json({ error: validationError });
    }

    const { name, program } = req.body;
    const parameter = { name, program, schedules: [] };
    const data = await studentAction.createStudent(parameter);

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const addSchedule = async (req, res) => {
  try {
    const validator = joi.object({
      scheduleId: joi.string().required(),
    });

    const { error } = validator.validate(req.body);

    if (error) {
      const validationError = normalizeError(error);
      return res.status(httpStatus.badRequest).json({ error: validationError });
    }

    const { params: { id: studentId }, body: { scheduleId } } = req;

    const student = await studentAction.getStudentById(studentId);

    if (!student) {
      return res.status(httpStatus.badRequest).json({ error: normalizeError('Student not found') });
    }

    const schedule = await scheduleAction.getScheduleById(scheduleId);

    if (!schedule) {
      return res.status(httpStatus.badRequest).json({ error: normalizeError('Schedule not found') });
    }

    const scheduleDuplicate = await studentAction.countStudent({
      _id: studentId, schedules: scheduleId,
    });

    if (scheduleDuplicate > 0) {
      return res.status(httpStatus.badRequest).json(
        {
          error: normalizeError('Student is already participating on the schedule'),
        },
      );
    }

    if (student.program !== schedule.program) {
      return res.status(httpStatus.badRequest).json({ error: normalizeError("Student's not eligible for the schedule") });
    }

    const allocatedCredit = await studentAction.totalCredit(studentId, schedule.semester);

    if (allocatedCredit + schedule.credit > maxCredit) {
      return res.status(httpStatus.badRequest).json(
        {
          error: normalizeError(`Allocated credit (${allocatedCredit}) plus the schedule's credit (${schedule.credit}) is bigger than the max credit (${maxCredit})`),
        },
      );
    }

    if ((allocatedCredit + schedule.credit) * minutePerCredit > maxMinute) {
      return res.status(httpStatus.badRequest).json(
        {
          error: normalizeError(`Allocated credit (${allocatedCredit}) plus the schedule's credit (${schedule.credit}) times the time per credit (${minutePerCredit} minute) is more than the max weekly study time (${maxMinute} minute)`),
        },
      );
    }

    const scheduleParticipant = await studentAction.countStudent({ schedules: scheduleId });

    if (scheduleParticipant >= maxStudentPerClassroom) {
      return res.status(httpStatus.badRequest).json(
        {
          error: normalizeError(`Number of schedule participant (${scheduleParticipant}) is more than or equal to the max number of student per classroom (${maxStudentPerClassroom})`),
        },
      );
    }

    const data = await studentAction.updateStudent(
      { _id: studentId },
      { $push: { schedules: scheduleId } },
      { new: true },
    );

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const programDistribution = async (req, res) => {
  try {
    const data = await studentAction.getProgramDistribution();

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const getStudentSummary = async (req, res) => {
  try {
    const data = await studentAction.getStudentSummary(req.params.id);

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

module.exports = (router) => {
  router.get('/', getAllStudent);
  router.get('/distribution', programDistribution);
  router.get('/summary/:id', getStudentSummary);
  router.get('/:id', getOneStudent);
  router.post('/', createStudent);
  router.put('/schedule/:id', addSchedule);
};
