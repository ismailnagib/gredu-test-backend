const Subject = require('../db/models/subject');
const SubjectPair = require('../db/models/subject-semester-program');

const getSubject = async (parameter = {}, projection = {}, option = {}) => {
  try {
    const data = await Subject.find(parameter, projection, option);
    return data;
  } catch (err) {
    throw err;
  }
};

const createSubject = async (parameter = {}) => {
  try {
    const data = await Subject.create(parameter);
    return data;
  } catch (err) {
    throw err;
  }
};

const getSubjectPair = async (parameter = {}, projection = {}, option = {}) => {
  try {
    const data = await SubjectPair.find(parameter, projection, option).populate('subject');
    return data;
  } catch (err) {
    throw err;
  }
};

const createSubjectPair = async (parameter = {}) => {
  try {
    const data = await SubjectPair.findOneAndUpdate(parameter, {}, { upsert: true, new: true });
    return data;
  } catch (err) {
    throw err;
  }
};

const deleteSubjectPair = async (parameter = {}) => {
  try {
    const data = await SubjectPair.deleteOne(parameter);
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getSubject,
  createSubject,
  getSubjectPair,
  createSubjectPair,
  deleteSubjectPair,
};
