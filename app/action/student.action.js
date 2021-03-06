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

const totalCredit = async (id, semester) => {
  try {
    const data = await Student.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
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

const getProgramDistribution = async () => {
  try {
    const totalCount = await Student.countDocuments();
    const data = await Student.aggregate([
      {
        $group: {
          _id: '$program',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $addFields: {
          percentage: {
            $multiply: [
              Math.round(100 / totalCount) / 100,
              '$count',
            ],
          },
        },
      },
    ]);

    return data;
  } catch (err) {
    throw err;
  }
};

const getStudentSummary = async (id) => {
  try {
    const data = await Student.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
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
        $lookup: {
          from: 'subjects',
          localField: 'schedules.subjectId',
          foreignField: '_id',
          as: 'schedules.subject',
        },
      },
      {
        $unwind: '$schedules.subject',
      },
      {
        $group: {
          _id: {
            semester: '$schedules.semester',
            subject: '$schedules.subject.name',
          },
          id: {
            $first: '$_id',
          },
          name: {
            $first: '$name',
          },
          program: {
            $first: '$program',
          },
          totalCredit: {
            $sum: '$schedules.credit',
          },
          detail: {
            $push: {
              classroom: '$schedules.classroom',
              day: '$schedules.day',
              credit: '$schedules.credit',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.semester',
          id: {
            $first: '$id',
          },
          name: {
            $first: '$name',
          },
          program: {
            $first: '$program',
          },
          subjects: {
            $push: {
              name: '$_id.subject',
              totalCredit: {
                $sum: '$totalCredit',
              },
              detail: '$detail',
            },
          },
        },
      },
      {
        $group: {
          _id: '$id',
          name: {
            $first: '$name',
          },
          program: {
            $first: '$program',
          },
          schedules: {
            $push: {
              semester: '$_id',
              subjects: '$subjects',
            },
          },
        },
      },
    ]);

    return result(data, '[0]', null);
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
  getProgramDistribution,
  getStudentSummary,
};
