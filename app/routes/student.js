const joi = require('@hapi/joi');
const studentAction = require('../action/student.action');
const normalizeError = require('../helpers/normalizeError');
const { httpStatus, enumValues } = require('../libs/constant');

const getAllStudent = async (req, res) => {
  try {
    const data = await studentAction.getStudent();

    return res.status(200).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(500).json({ error });
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
    const parameter = { name, program };
    const data = await studentAction.createStudent(parameter);

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

module.exports = (router) => {
  router.get('/', getAllStudent);
  router.get('/:id', getOneStudent);
  router.post('/', createStudent);
};
