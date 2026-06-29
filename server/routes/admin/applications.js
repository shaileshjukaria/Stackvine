const router = require('express').Router();
const auth = require('../../middleware/auth');
const Application = require('../../models/Application');

// GET /api/admin/applications
router.get('/', auth, async (req, res, next) => {
  try {
    // Exclude binary resume data from the list — fetch separately on download
    const apps = await Application.find()
      .select('-resume.data')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) { next(err); }
});

// GET /api/admin/applications/:id/resume  — download resume file
router.get('/:id/resume', auth, async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id).select('resume name');
    if (!app || !app.resume || !app.resume.data) {
      return res.status(404).json({ error: 'No resume found for this application.' });
    }
    const { data, contentType, filename } = app.resume;
    const safeFilename = encodeURIComponent(filename || `resume-${app.name}.pdf`);
    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.send(data);
  } catch (err) { next(err); }
});

// PATCH /api/admin/applications/:id/read
router.patch('/:id/read', auth, async (req, res, next) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read ?? true },
      { new: true }
    ).select('-resume.data');
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch (err) { next(err); }
});

// DELETE /api/admin/applications/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
