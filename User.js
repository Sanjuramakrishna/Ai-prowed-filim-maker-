const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['director', 'writer', 'cinematographer', 'editor', 'producer'],
    default: 'writer'
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
