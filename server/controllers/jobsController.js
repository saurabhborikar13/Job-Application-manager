const Job = require('../models/Job');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// 1. GET all jobs (Filtered by User)
const getAllJobs = async (req, res) => {
  try {
    // Only fetch jobs that belong to the logged-in user
    const jobs = await Job.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 2. CREATE a new job (Linked to User)
const createJob = async (req, res) => {
  try {
    // Add the logged-in user's ID to the job data
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// 3. GET a single job
const getJob = async (req, res) => {
  const { user: { userId }, params: { id: jobId } } = req;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(404).json({ msg: 'No job found' });
  }

  // Ensure we only find a job if it matches BOTH the Job ID and the User ID
  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    return res.status(404).json({ msg: `No job with id ${jobId}` });
  }

  res.status(200).json(job);
};

// 4. DELETE a job
const deleteJob = async (req, res) => {
  const { user: { userId }, params: { id: jobId } } = req;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(404).json({ msg: 'No job found' });
  }

  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    return res.status(404).json({ msg: `No job with id ${jobId}` });
  }

  res.status(200).json({ msg: 'Job deleted successfully' });
};

// 5. UPDATE a job
const updateJob = async (req, res) => {
  const { user: { userId }, params: { id: jobId } } = req;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(404).json({ msg: 'No job found' });
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    return res.status(404).json({ msg: `No job with id ${jobId}` });
  }

  res.status(200).json(job);
};


const showStats=async(req,res)=>{
  let stats = await Job.aggregate([
    {$match: {createdBy:new mongoose.Types.ObjectId(req.user.userId)}},
    {$group:{_id:'$status', count : {$sum  : 1}}},
  ]);

  // array to obj
  stats = stats.reduce((acc,curr)=>{
    const {_id:title,count} = curr;
    acc[title] = count;
    return acc;
  },{});

  const defaultsStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    offer : stats.offer || 0,
    declined: stats.declined || 0, 
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 }, 
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const { _id: { year, month }, count } = item;
      const date = new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
      return { date, count };
    })
    .reverse(); // old to new

  res.status(200).json({ defaultStats, monthlyApplications });
};
module.exports = {
  getAllJobs,
  createJob,
  getJob,
  deleteJob,
  updateJob,
  showStats
};