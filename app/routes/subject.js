const joi = require('@hapi/joi');
const subjectAction = require('../action/subject.action');
const normalizeError = require('../helpers/normalizeError');
const { httpStatus } = require('../libs/constant');

const getAllSubject = async (req, res) => {
  try {
    const data = await subjectAction.getSubject();

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const createSubject = async (req, res) => {
  try {
    const validator = joi.object({
      name: joi.string().required(),
    });

    const { error } = validator.validate(req.body);

    if (error) {
      const validationError = normalizeError(error);
      return res.status(httpStatus.badRequest).json({ error: validationError });
    }

    const { name } = req.body;
    const data = await subjectAction.createSubject({ name });

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

module.exports = (router) => {
  router.get('/', getAllSubject);
  router.post('/', createSubject);
};
