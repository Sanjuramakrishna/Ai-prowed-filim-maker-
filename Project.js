const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  genre: {
    type: String,
    enum: ['drama', 'comedy', 'thriller', 'horror', 'documentary', 'animation', 'other'],
    default: 'drama'
  },
  status: {
    type: String,
    enum: ['planning', 'pre-production', 'production', 'post-production', 'completed'],
    default: 'planning'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['director', 'writer', 'cinematographer', 'editor', 'producer', 'viewer']
    },
    permissions: {
      canEdit: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false }
    }
  }],
  script: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Script'
  },
  storyboard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Storyboard'
  },
  transcripts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transcript'
  }],
  research: [{
    title: String,
    content: String,
    type: {
      type: String,
      enum: ['note', 'reference', 'inspiration']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
