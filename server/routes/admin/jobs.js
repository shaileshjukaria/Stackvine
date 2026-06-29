const router = require('express').Router();
const auth = require('../../middleware/auth');
const Job = require('../../models/Job');

// GET all (including inactive)
router.get('/', auth, async (req, res, next) => {
  try {
    res.json(await Job.find().sort({ order: 1 }));
  } catch (err) { next(err); }
});

// POST create
router.post('/', auth, async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) { next(err); }
});

// PUT update
router.put('/:id', auth, async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ error: 'Not found' });
    res.json(job);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/:id', auth, async (req, res, next) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
