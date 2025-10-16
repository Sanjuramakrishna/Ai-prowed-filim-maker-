const express = require('express');
const Transcript = require('../models/Transcript');
const auth = require('../middleware/auth');

const router = express.Router();

// Get transcripts for project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const transcripts = await Transcript.find({ project: req.params.projectId })
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });

    res.json(transcripts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transcript by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id)
      .populate('uploadedBy', 'username')
      .populate('project', 'title');

    if (!transcript) {
      return res.status(404).json({ message: 'Transcript not found' });
    }

    res.json(transcript);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transcript (add notes, tags)
router.put('/:id', auth, async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);

    if (!transcript) {
      return res.status(404).json({ message: 'Transcript not found' });
    }

    const { notes, tags } = req.body;
    transcript.notes = notes !== undefined ? notes : transcript.notes;
    transcript.tags = tags !== undefined ? tags : transcript.tags;

    await transcript.save();
    await transcript.populate('uploadedBy', 'username');

    res.json(transcript);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transcript
router.delete('/:id', auth, async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);

    if (!transcript) {
      return res.status(404).json({ message: 'Transcript not found' });
    }

    // Check if user uploaded it or is project owner
    if (transcript.uploadedBy.toString() !== req.user.userId) {
      // TODO: Check project ownership
      return res.status(403).json({ message: 'Delete permission denied' });
    }

    // TODO: Delete file from storage
    await Transcript.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transcript deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search transcripts
router.get('/search/:projectId', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const transcripts = await Transcript.find({
      project: req.params.projectId,
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .populate('uploadedBy', 'username')
    .sort({ createdAt: -1 });

    res.json(transcripts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
