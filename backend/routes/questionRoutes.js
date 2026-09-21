const express = require('express');
const router = express.Router();
const { getNextQuestion, answerQuestion } = require('../controllers/questionController');

router.get('/next', getNextQuestion);
router.post('/:id/answer', answerQuestion);

module.exports = router;
