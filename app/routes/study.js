const joi = require('@hapi/joi');
const isNil = require('lodash/isNil');
const get = require('lodash/get');
const studyAction = require('../action/study.action');
const studentAction = require('../action/student.action');
const classroomAction = require('../action/classroom.action');
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
      schedule: joi.array().items(
        joi.object({
          day: joi.number().required().min(1).max(maxDay),
          allocatedCredit: joi.number().required().min(1),
          classroom: joi.number().required().min(1).max(maxClassroom),
          subject: joi.string().required(),
        }),
      ).required().min(1),
    });

    const { error } = validator.validate(req.body);

    if (error) {
      const validationError = normalizeError(error);
      return res.status(httpStatus.badRequest).json({ error: validationError });
    }

    const {
      studentId,
      semester,
      schedule,
    } = req.body;

    const student = await studentAction.getStudentById(studentId);

    if (isNil(student)) {
      const studentNotFoundError = { error: { message: `Student with studentId: ${studentId} was not found` } };
      return res.status(httpStatus.badRequest).json(studentNotFoundError);
    }

    const currentAllocation = await studyAction.getAllocatedCreditAndMinute(studentId, semester);
    const checkClassroomAvailability = [];
    const classroomAvailable = {
      status: true,
      error: null,
    };

    let totalAllocatedCredit = 0;
    let totalAllocatedMinute = 0;

    for (let i = 0, len = schedule.length; i < len; i += 1) {
      const { allocatedCredit, classroom, day } = schedule[i];
      const allocatedMinute = allocatedCredit * minutePerCredit;
      schedule[i].allocatedMinute = allocatedMinute;
      totalAllocatedCredit += allocatedCredit;
      totalAllocatedMinute += allocatedMinute;
      checkClassroomAvailability.push(classroomAction.checkAvailability({
        studentId, semester, day, classroom,
      }));
    }

    await Promise.all(checkClassroomAvailability)
      .catch((err) => {
        classroomAvailable.status = false;
        classroomAvailable.error = normalizeError(err);
      });

    if (!classroomAvailable.status) {
      return res.status(httpStatus.badRequest).json(classroomAvailable.error);
    }

    if (currentAllocation.credit + totalAllocatedCredit > maxCredit) {
      return res.status(httpStatus.badRequest).json({
        message: `Current allocated credit (${currentAllocation.credit}) plus requested credit allocation (${totalAllocatedCredit}) is bigger than the max credit (${maxCredit})`,
      });
    }

    if (currentAllocation.minute + totalAllocatedMinute > maxMinute) {
      return res.status(httpStatus.badRequest).json({
        message: `Current allocated time (${currentAllocation.minute} minute) plus requested time allocation (${totalAllocatedMinute} minute) is bigger than the max weekly study time (${maxMinute} minute)`,
      });
    }

    const baseParameter = {
      studentId,
      semester,
    };

    const study = await studyAction.getStudy(baseParameter, null, { limit: 1 });

    let data = {};

    if (study.length > 0) {
      const parameter = {
        $push: { schedule },
        $inc: {
          totalAllocatedCredit,
          totalAllocatedMinute,
        },
      };

      data = await studyAction.updateStudyById(get(study[0], '_id'), parameter, { new: true });
    } else {
      const parameter = {
        ...baseParameter,
        schedule,
        totalAllocatedCredit,
        totalAllocatedMinute,
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
