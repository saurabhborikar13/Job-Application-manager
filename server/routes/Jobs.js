const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');

const {
  getAllJobs,
  createJob,
  getJob,
  deleteJob,
  updateJob,
  showStats
} = require('../controllers/jobsController');

// GET all jobs & POST a new job
router.use(authenticateUser);
router.route('/').get(getAllJobs).post(createJob);

router.route('/stats').get(showStats);
// GET, DELETE, UPDATE a specific job by ID

router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);

module.exports = router;