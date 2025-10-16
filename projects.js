const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.userId },
        { 'collaborators.user': req.user.userId }
      ]
    })
    .populate('owner', 'username')
    .populate('collaborators.user', 'username')
    .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, genre } = req.body;

    const project = new Project({
      title,
      description,
      genre,
      owner: req.user.userId
    });

    await project.save();
    await project.populate('owner', 'username');

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username')
      .populate('collaborators.user', 'username')
      .populate('script')
      .populate('storyboard')
      .populate('transcripts');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access
    const hasAccess = project.owner._id.toString() === req.user.userId ||
      project.collaborators.some(collab => collab.user._id.toString() === req.user.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner or has edit permissions
    const isOwner = project.owner.toString() === req.user.userId;
    const collaborator = project.collaborators.find(collab => collab.user.toString() === req.user.userId);
    const canEdit = isOwner || (collaborator && collaborator.permissions.canEdit);

    if (!canEdit) {
      return res.status(403).json({ message: 'Edit permission denied' });
    }

    const { title, description, genre, status } = req.body;
    project.title = title || project.title;
    project.description = description || project.description;
    project.genre = genre || project.genre;
    project.status = status || project.status;

    await project.save();
    await project.populate('owner', 'username');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add collaborator
router.post('/:id/collaborators', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only project owner can add collaborators' });
    }

    const { userId, role, canEdit, canDelete } = req.body;

    // Check if already a collaborator
    const existingCollaborator = project.collaborators.find(collab => collab.user.toString() === userId);
    if (existingCollaborator) {
      return res.status(400).json({ message: 'User is already a collaborator' });
    }

    project.collaborators.push({
      user: userId,
      role,
      permissions: { canEdit, canDelete }
    });

    await project.save();
    await project.populate('collaborators.user', 'username');

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only project owner can delete project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
