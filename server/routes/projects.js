const router = require('express').Router();
const Project = require('../models/Project');

// GET /api/projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
