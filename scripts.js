const express = require('express');
const Script = require('../models/Script');
const auth = require('../middleware/auth');

const router = express.Router();

// Get scripts for project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const scripts = await Script.find({ project: req.params.projectId })
      .populate('author', 'username')
      .sort({ updatedAt: -1 });

    res.json(scripts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new script
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, projectId } = req.body;

    const script = new Script({
      title,
      content,
      project: projectId,
      author: req.user.userId
    });

    // Calculate metadata
    script.metadata = {
      wordCount: content.split(' ').length,
      pageCount: Math.ceil(content.split(' ').length / 200),
      sceneCount: (content.match(/CUT TO:/g) || []).length,
      lastEdited: new Date()
    };

    await script.save();
    await script.populate('author', 'username');

    res.status(201).json(script);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get script by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const script = await Script.findById(req.params.id)
      .populate('author', 'username')
      .populate('collaborators.user', 'username');

    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }

    res.json(script);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update script
router.put('/:id', auth, async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);

    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }

    const { title, content } = req.body;
    script.title = title || script.title;
    script.content = content || script.content;
    script.metadata.lastEdited = new Date();

    if (content) {
      script.metadata = {
        ...script.metadata,
        wordCount: content.split(' ').length,
        pageCount: Math.ceil(content.split(' ').length / 200),
        sceneCount: (content.match(/CUT TO:/g) || []).length
      };
    }

    await script.save();
    await script.populate('author', 'username');

    res.json(script);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add AI suggestion
router.post('/:id/suggestions', auth, async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);

    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }

    const { suggestion } = req.body;
    script.aiSuggestions.push({ suggestion });

    await script.save();
    res.json(script.aiSuggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply AI suggestion
router.put('/:id/suggestions/:suggestionId/apply', auth, async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);

    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }

    const suggestion = script.aiSuggestions.id(req.params.suggestionId);
    if (suggestion) {
      suggestion.applied = true;
      await script.save();
    }

    res.json(script.aiSuggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete script
router.delete('/:id', auth, async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);

    if (!script) {
      return res.status(404).json({ message: 'Script not found' });
    }

    // Check permissions (author or project owner)
    if (script.author.toString() !== req.user.userId) {
      // TODO: Check if user is project owner
      return res.status(403).json({ message: 'Delete permission denied' });
    }

    await Script.findByIdAndDelete(req.params.id);
    res.json({ message: 'Script deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
