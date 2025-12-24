const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
  },
  position: {
    type: String,
    required: [true, 'Please provide position title'],
    maxlength: 100,
  },
  status: {
    type: String,
    enum: ['pending', 'interview', 'declined', 'offer'], // Restricted values
    default: 'pending',
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'remote', 'internship'],
    default: 'full-time',
  },
  jobLocation: {
    type: String,
    default: 'my city',
    required: true,
  },

  resumeLink: {
    type: String,
    default: '', 
    // In Phase 2, clod resume
  },
  
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User', 
  },
}, { timestamps: true }); 

module.exports = mongoose.model('Job', JobSchema);