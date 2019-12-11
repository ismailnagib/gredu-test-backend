const Student = require('../db/models/student');

const getStudent = async (parameter = {}, projection = {}, option = {}) => {
  try {
    const data = await Student.find(parameter, projection, option);
    return data;
  } catch (err) {
    throw err;
  }
};

const getStudentById = async (id) => {
  try {
    const data = await Student.findById(id);
    return data;
  } catch (err) {
    throw err;
  }
};

const createStudent = async (parameter = {}) => {
  try {
    const data = await Student.create(parameter);
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getStudent,
  getStudentById,
  createStudent,
};
