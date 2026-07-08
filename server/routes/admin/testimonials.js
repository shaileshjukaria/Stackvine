const router = require('express').Router();
const auth = require('../../middleware/auth');
const Testimonial = require('../../models/Testimonial');

router.get('/', auth, async (req, res, next) => {
  try { res.json(await Testimonial.find().sort({ order: 1 })); }
  catch (err) { next(err); }
});

router.post('/', auth, async (req, res, next) => {
  try { res.status(201).json(await Testimonial.create(req.body)); }
  catch (err) { next(err); }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json(t);
  } catch (err) { next(err); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
