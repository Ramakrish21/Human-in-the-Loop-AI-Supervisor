const express = require('express');
const router = express.Router();
const controller = require('../controllers/knowledgeController');

// GET /api/knowledge/
router.get('/', controller.getLearnedAnswers);

module.exports = router;