const joi = require('@hapi/joi');
const isNil = require('lodash/isNil');
const get = require('lodash/get');
const studyAction = require('../action/study.action');
const studentAction = require('../action/student.action');
const classroomAction = require('../action/classroom.action');
const subjectAction = require('../action/subject.action');
const normalizeError = require('../helpers/normalizeError');
const { httpStatus } = require('../libs/constant');
const {
  maxClassroom, maxDay, minutePerCredit, maxCredit, maxMinute,
} = require('../libs/constraint');

const getAllStudy = async (req, res) => {
  try {
    const data = await studyAction.getStudy();

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const getOneStudy = async (req, res) => {
  try {
    const data = await studyAction.getStudyById(req.params.id);

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const createStudy = async (req, res) => {
  try {
    const validator = joi.object({
      studentId: joi.string().required(),
      semester: joi.object({
        number: joi.number().required().min(1).max(2),
        year: joi.number().required().min(0),
      }).required(),
      schedule: joi.object({
        day: joi.number().required().min(1).max(maxDay),
        allocatedCredit: joi.number().required().min(1),
        classroom: joi.number().required().min(1).max(maxClassroom),
        subjectId: joi.string().required(),
      }).required().min(1),
    });

    const { error } = validator.validate(req.body);

    if (error) {
      const validationError = normalizeError(error);
      return res.status(httpStatus.badRequest).json({ error: validationError });
    }

    const {
      studentId,
      semester: { number, year },
      schedule: {
        subjectId, allocatedCredit, classroom, day,
      },
    } = req.body;

    const student = await studentAction.getStudentById(studentId);

    if (isNil(student)) {
      return res.status(httpStatus.badRequest).json({
        error: normalizeError(`Student with studentId: ${studentId} was not found`),
      });
    }

    const subjectPair = await subjectAction.getSubjectPair(
      {
        subjectId,
        semester: { number, year },
        program: student.program,
      },
    );

    if (subjectPair.length < 1) {
      return res.status(httpStatus.badRequest).json({
        error: normalizeError("The subject doesn't exist or the student is not allowed to choose the subject"),
      });
    }

    const baseParameter = {
      studentId,
      semester: { number, year },
    };

    const study = await studyAction.getStudy(baseParameter, null, { limit: 1 });

    if (study.length > 0) {
      const subjectDuplicate = study[0].schedules.find(
        schedule => schedule.subjectId.toString() === subjectId,
      );

      if (!isNil(subjectDuplicate)) {
        return res.status(httpStatus.badRequest).json({
          error: normalizeError('The student has previously chosen the subject'),
        });
      }
    }

    const currentAllocation = await studyAction.getAllocatedCreditAndMinute(baseParameter);
    const allocatedMinute = allocatedCredit * minutePerCredit;

    await classroomAction.checkAvailability({
      studentId, semester: { number, year }, day, classroom,
    });

    if (currentAllocation.credit + allocatedCredit > maxCredit) {
      return res.status(httpStatus.badRequest).json({
        error: normalizeError(`Current allocated credit (${currentAllocation.credit}) plus requested credit allocation (${allocatedCredit}) is bigger than the max credit (${maxCredit})`),
      });
    }

    if (currentAllocation.minute + allocatedMinute > maxMinute) {
      return res.status(httpStatus.badRequest).json({
        error: normalizeError(`Current allocated time (${currentAllocation.minute} minute) plus requested time allocation (${allocatedMinute} minute) is bigger than the max weekly study time (${maxMinute} minute)`),
      });
    }

    let data = {};

    const schedule = {
      day,
      allocatedCredit,
      allocatedMinute,
      classroom,
      subjectId,
    };

    if (study.length > 0) {
      const parameter = {
        $push: { schedules: schedule },
        $inc: {
          totalAllocatedCredit: allocatedCredit,
          totalAllocatedMinute: allocatedMinute,
        },
      };

      data = await studyAction.updateStudyById(get(study[0], '_id'), parameter, { new: true });
    } else {
      const parameter = {
        ...baseParameter,
        schedules: [schedule],
        totalAllocatedCredit: allocatedCredit,
        totalAllocatedMinute: allocatedMinute,
      };

      data = await studyAction.createStudy(parameter);
    }

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

module.exports = (router) => {
  router.get('/', getAllStudy);
  router.get('/:id', getOneStudy);
  router.post('/', createStudy);
};
