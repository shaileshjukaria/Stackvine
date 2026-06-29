const router = require('express').Router();
const auth = require('../../middleware/auth');
const Contact = require('../../models/Contact');

// GET /api/admin/contacts
router.get('/', auth, async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) { next(err); }
});

// PATCH /api/admin/contacts/:id/read
router.patch('/:id/read', auth, async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read ?? true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json(contact);
  } catch (err) { next(err); }
});

// DELETE /api/admin/contacts/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
