const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentDetails,
  getConceptAnalytics,
} = require('../controllers/teacherController');

router.get('/students', getStudents);
router.get('/student/:id', getStudentDetails);
router.get('/concepts', getConceptAnalytics);

module.exports = router;
