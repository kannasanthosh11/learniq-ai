const express = require('express');
const router = express.Router();
const { getConcepts, getConceptById } = require('../controllers/conceptController');

router.get('/', getConcepts);
router.get('/:id', getConceptById);

module.exports = router;
