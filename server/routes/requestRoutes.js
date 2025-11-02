const express = require('express');
const router = express.Router();
const controller = require('../controllers/requestController');

// GET /api/requests/
router.get('/', controller.getAllRequests);

// GET /api/requests/pending
router.get('/pending', controller.getPendingRequests);

// POST /api/requests/
router.post('/', controller.createRequest);

// POST /api/requests/:requestId/resolve
router.post('/:requestId/resolve', controller.resolveRequest);

module.exports = router;