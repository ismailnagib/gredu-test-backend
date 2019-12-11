const joi = require('@hapi/joi');
const subjectAction = require('../action/subject.action');
const normalizeError = require('../helpers/normalizeError');
const { httpStatus, enumValues } = require('../libs/constant');

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

    const { name, program } = req.body;
    const parameter = { name, program };
    const data = await subjectAction.createSubject(parameter);

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const getSubjectPair = async (req, res) => {
  try {
    const data = await subjectAction.getSubjectPair({ subjectId: req.params.id });

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const createSubjectPair = async (req, res) => {
  try {
    const validator = joi.object({
      semester: joi.object({
        number: joi.number().required().min(1).max(2),
        year: joi.number().required().min(0),
      }).required(),
      program: joi.string().valid(...enumValues.program).required(),
    });

    const { error } = validator.validate(req.body);

    if (error) {
      const validationError = normalizeError(error);
      return res.status(httpStatus.badRequest).json({ error: validationError });
    }

    const { params: { id: subjectId }, body: { semester, program } } = req;
    const parameter = { subjectId, semester, program };
    const data = await subjectAction.createSubjectPair(parameter);

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const deleteSubjectPair = async (req, res) => {
  try {
    const validator = joi.object({
      semester: joi.object({
        number: joi.number().required().min(1).max(2),
        year: joi.number().required().min(0),
      }).required(),
      program: joi.string().valid(...enumValues.program).required(),
    });

    const { error } = validator.validate(req.body);

    if (error) {
      const validationError = normalizeError(error);
      return res.status(httpStatus.badRequest).json({ error: validationError });
    }

    const { params: { id: subjectId }, body: { semester, program } } = req;
    const parameter = { subjectId, semester, program };
    const { deletedCount } = await subjectAction.deleteSubjectPair(parameter);

    return res.status(httpStatus.success).json({ data: { deletedCount } });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

module.exports = (router) => {
  router.get('/', getAllSubject);
  router.post('/', createSubject);
  router.get('/pair/:id', getSubjectPair);
  router.post('/pair/:id', createSubjectPair);
  router.delete('/pair/:id', deleteSubjectPair);
};
