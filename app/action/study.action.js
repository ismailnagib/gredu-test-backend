const mongoose = require('mongoose');
const Study = require('../db/models/study');

const getStudy = async (parameter = {}, projection = {}, option = {}) => {
  try {
    const data = await Study.find(parameter, projection, option).populate('student');
    return data;
  } catch (err) {
    throw err;
  }
};

const getStudyById = async (id) => {
  try {
    const data = await Study.findById(id).populate('student');
    return data;
  } catch (err) {
    throw err;
  }
};

const createStudy = async (parameter = {}) => {
  try {
    const data = await Study.create(parameter);
    return data;
  } catch (err) {
    throw err;
  }
};

const updateStudyById = async (id, parameter = {}, option = {}) => {
  try {
    const data = await Study.findByIdAndUpdate(id, parameter, option);
    return data;
  } catch (err) {
    throw err;
  }
};

const getAllocatedCreditAndMinute = async (studentId, semester) => {
  try {
    const data = await Study.aggregate([
      {
        $match: {
          studentId: mongoose.Types.ObjectId(studentId),
          semester,
        },
      },
      {
        $group: {
          _id: '$_id',
          credit: {
            $sum: '$totalAllocatedCredit',
          },
          minute: {
            $sum: '$totalAllocatedMinute',
          },
        },
      },
    ]);

    return {
      credit: data.length > 0 ? data[0].credit : 0,
      minute: data.length > 0 ? data[0].minute : 0,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getStudy,
  getStudyById,
  createStudy,
  updateStudyById,
  getAllocatedCreditAndMinute,
};
