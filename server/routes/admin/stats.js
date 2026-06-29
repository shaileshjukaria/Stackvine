const router = require('express').Router();
const auth = require('../../middleware/auth');
const Stat = require('../../models/Stat');

// GET all stats
router.get('/', auth, async (req, res, next) => {
  try {
    res.json(await Stat.find());
  } catch (err) { next(err); }
});

// PATCH update a stat value by key
router.patch('/:key', auth, async (req, res, next) => {
  try {
    const stat = await Stat.findOneAndUpdate(
      { key: req.params.key },
      { $set: { value: req.body.value, label: req.body.label, suffix: req.body.suffix } },
      { new: true, runValidators: true }
    );
    if (!stat) return res.status(404).json({ error: 'Stat not found' });
    res.json(stat);
  } catch (err) { next(err); }
});

module.exports = router;
