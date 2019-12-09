const Student = require('../db/models/student');
const normalizeError = require('../helpers/normalizeError');
const { httpStatus } = require('../libs/constant');

const getAllStudent = async (req, res) => {
  try {
    const data = await Student.find({});

    return res.status(200).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(500).json({ error });
  }
};

const getOneStudent = async (req, res) => {
  try {
    const data = await Student.findById(req.params.id);

    return res.status(httpStatus.success).json({ data });
  } catch (err) {
    const error = normalizeError(err);

    return res.status(httpStatus.internalServerError).json({ error });
  }
};

const createStudent = async (req, res) => {
  try {
    req.checkBody('name', 'name is required').notEmpty();

    const validationError = req.validationErrors();

    if (validationError) {
      const error = normalizeError(validationError);
      return res.status(httpStatus.badRequest).json({ error });
    }

    const parameter = { name: req.body.name };
    const data = await Student.create(parameter);

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
