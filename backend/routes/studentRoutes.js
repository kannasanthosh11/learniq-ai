const express = require('express');
const router = express.Router();
const {
  getStudent,
  getMastery,
  getGaps,
  getRecommendations,
  getGraph,
  getProgress,
} = require('../controllers/studentController');

router.get('/:id', getStudent);
router.get('/:id/mastery', getMastery);
router.get('/:id/gaps', getGaps);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id/graph', getGraph);
router.get('/:id/progress', getProgress);

module.exports = router;
