const result = require('lodash/result');
const mongoose = require('mongoose');
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
    const data = await Student.findById(id).populate({
      path: 'schedules',
      populate: 'subject',
    });

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

const countStudent = async (parameter = {}) => {
  try {
    const data = await Student.countDocuments(parameter);
    return data;
  } catch (err) {
    throw err;
  }
};

const totalCredit = async (studentId, semester) => {
  try {
    const data = await Student.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(studentId),
        },
      },
      {
        $project: {
          schedules: 1,
        },
      },
      {
        $unwind: '$schedules',
      },
      {
        $lookup: {
          from: 'schedules',
          localField: 'schedules',
          foreignField: '_id',
          as: 'schedules',
        },
      },
      {
        $unwind: '$schedules',
      },
      {
        $match: {
          'schedules.semester.number': semester.number,
          'schedules.semester.year': semester.year,
        },
      },
      {
        $group: {
          _id: null,
          sum: {
            $sum: '$schedules.credit',
          },
        },
      },
    ]);

    return result(data, '[0].sum', 0);
  } catch (err) {
    throw err;
  }
};

const updateStudent = async (parameter = {}, update = {}, option = {}) => {
  try {
    const data = await Student.findOneAndUpdate(parameter, update, option);
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getStudent,
  getStudentById,
  createStudent,
  countStudent,
  totalCredit,
  updateStudent,
};
