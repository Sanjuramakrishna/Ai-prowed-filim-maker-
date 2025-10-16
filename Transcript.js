const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalFile: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  },
  content: {
    type: String,
    required: true
  },
  duration: {
    type: String, // HH:MM:SS format
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiMetadata: {
    confidence: Number,
    language: {
      type: String,
      default: 'en'
    },
    speakers: [{
      name: String,
      segments: [{
        start: Number,
        end: Number,
        text: String
      }]
    }]
  },
  tags: [String],
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Transcript', transcriptSchema);
