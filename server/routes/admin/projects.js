const router = require('express').Router();
const auth = require('../../middleware/auth');
const Project = require('../../models/Project');

// GET all
router.get('/', auth, async (req, res, next) => {
  try {
    res.json(await Project.find().sort({ order: 1 }));
  } catch (err) { next(err); }
});

// POST create
router.post('/', auth, async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) { next(err); }
});

// PUT update
router.put('/:id', auth, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/:id', auth, async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
