const express = require('express');
const router = express.Router();
const { analyzeProfile, setApiKey, getAiStatus } = require('../controllers/aiController');

router.post('/analyze-profile', analyzeProfile);
router.post('/set-key', setApiKey);
router.get('/status', getAiStatus);

module.exports = router;
