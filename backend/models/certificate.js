const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  surname: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  mobileNumber: { type: String, required: true },
  standard: { type: String, required: true },
  schoolName: { type: String, required: true },
  studentPicture: { type: String, required: true },
  courseName: { type: String, required: true },
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;