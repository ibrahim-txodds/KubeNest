// backend/src/routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const namespaceController = require('../controllers/namespaceController');

router.get('/namespaces', namespaceController.listNamespaces);

module.exports = router;
