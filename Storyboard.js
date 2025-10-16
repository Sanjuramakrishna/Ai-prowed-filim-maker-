const mongoose = require('mongoose');

const storyboardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  scenes: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    image: String, // URL or path to image
    shotType: {
      type: String,
      enum: ['wide', 'medium', 'close-up', 'extreme-close-up', 'overhead', 'low-angle', 'high-angle']
    },
    cameraMovement: {
      type: String,
      enum: ['static', 'pan', 'tilt', 'zoom', 'track', 'dolly', 'crane']
    },
    lighting: {
      type: String,
      enum: ['natural', 'studio', 'practical', 'motivated', 'high-key', 'low-key']
    },
    notes: String,
    duration: Number, // in seconds
    order: {
      type: Number,
      required: true
    },
    collaborators: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comment: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String
  }],
  version: {
    type: Number,
    default: 1
  },
  lastEdited: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Storyboard', storyboardSchema);
