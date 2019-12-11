const Subject = require('../db/models/subject');

const getSubject = async (parameter = {}, projection = {}, option = {}) => {
  try {
    const data = await Subject.find(parameter, projection, option);
    return data;
  } catch (err) {
    throw err;
  }
};

const getSubjectById = async (id) => {
  try {
    const data = await Subject.findById(id);
    return data;
  } catch (err) {
    throw err;
  }
};

const createSubject = async (parameter = {}) => {
  try {
    const data = await Subject.findOneAndUpdate(parameter, {}, { upsert: true, new: true });
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getSubject,
  getSubjectById,
  createSubject,
};
