const mongoose = require('mongoose');
const { enumValues } = require('../../libs/constant');

const semester = {
  number: { type: Number, min: 1, max: 2 },
  year: { type: Number, min: 0 },
};

const subjectSemesterProgramSchema = new mongoose.Schema({
  semester,
  program: { type: String, enum: enumValues.program },
  subjectId: { type: mongoose.Schema.Types.ObjectId },
}, {
  id: false,
  toJSON: {
    virtuals: true,
  },
});

subjectSemesterProgramSchema.virtual('subject', {
  ref: 'Subject',
  localField: 'subjectId',
  foreignField: '_id',
  justOne: true,
});

module.exports = mongoose.model('SubjectSemesterProgram', subjectSemesterProgramSchema);
