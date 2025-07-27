const express = require('express');
const router = express.Router();
const { getAllIssues, createIssue, updateIssue } = require('../controllers/issueController');

router.get('/', getAllIssues);
router.post('/', createIssue);
router.put('/:id', updateIssue);

module.exports = router;
