const Schedule = require('../db/models/schedule');

const getSchedule = async (parameter = {}, projection = {}, option = {}) => {
  try {
    const data = await Schedule.find(parameter, projection, option).populate('subject');
    return data;
  } catch (err) {
    throw err;
  }
};

const getScheduleById = async (id) => {
  try {
    const data = await Schedule.findById(id);
    return data;
  } catch (err) {
    throw err;
  }
};

const createSchedule = async (parameter = {}) => {
  try {
    const data = await Schedule.findOneAndUpdate(parameter, {}, { upsert: true, new: true });
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getSchedule,
  getScheduleById,
  createSchedule,
};
