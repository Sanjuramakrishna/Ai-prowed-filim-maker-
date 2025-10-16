const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String
  }],
  aiSuggestions: [{
    suggestion: String,
    applied: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    wordCount: Number,
    pageCount: Number,
    sceneCount: Number,
    lastEdited: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Script', scriptSchema);
