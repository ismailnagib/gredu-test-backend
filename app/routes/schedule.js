const joi = require('@hapi/joi');
const scheduleAction = require('../action/schedule.action');
const normalizeError = require('../helpers/normalizeError');
const { httpStatus, enumValues } = require('../libs/constant');
const { maxClassroom, maxDay, maxCredit } = require('../libs/constraint');


const getSchedule = async (req, res) => {
  try {
    const data = await scheduleAction.getSchedule({ subjectId: req.params.id });

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const createSchedule = async (req, res) => {
  try {
    const validator = joi.object({
      semester: joi.object({
        number: joi.number().required().min(1).max(2),
        year: joi.number().required().min(0),
      }).required(),
      program: joi.string().valid(...enumValues.program).required(),
      subjectId: joi.string().required(),
      classroom: joi.number().required().min(1).max(maxClassroom),
      day: joi.number().required().min(1).max(maxDay),
      credit: joi.number().required().min(1).max(maxCredit),
    });

    const { error } = validator.validate(req.body);

    if (error) {
      const validationError = normalizeError(error);
      return res.status(httpStatus.badRequest).json({ error: validationError });
    }

    const {
      semester: { number, year }, program, subjectId, classroom, day, credit,
    } = req.body;
    const parameter = {
      semester: { number, year }, program, subjectId, classroom, day, credit,
    };
    const data = await scheduleAction.createSchedule(parameter);

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

module.exports = (router) => {
  router.get('/', getSchedule);
  router.post('/', createSchedule);
};
