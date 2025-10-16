const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const Transcript = require('../models/Transcript');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and video files are allowed'));
    }
  }
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Transcribe audio/video
router.post('/transcribe', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create transcript record
    const transcript = new Transcript({
      title: req.body.title || req.file.originalname,
      originalFile: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      },
      duration: req.body.duration || '00:00:00',
      status: 'processing',
      project: req.body.projectId,
      uploadedBy: req.body.userId
    });

    await transcript.save();

    // Process transcription with OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: req.file,
      model: 'whisper-1',
      response_format: 'json'
    });

    // Update transcript with content
    transcript.content = transcription.text;
    transcript.status = 'completed';
    await transcript.save();

    res.json({
      transcriptId: transcript._id,
      content: transcription.text,
      status: 'completed'
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ message: 'Transcription failed' });
  }
});

// Generate script suggestions
router.post('/script-suggestions', async (req, res) => {
  try {
    const { scriptContent, context } = req.body;

    const prompt = `As a professional screenwriter, analyze this script excerpt and provide 3-5 specific, actionable suggestions for improvement:

Script Excerpt:
${scriptContent}

Context: ${context || 'General script improvement'}

Please provide suggestions that focus on:
- Character development
- Dialogue improvement
- Scene structure
- Pacing and tension
- Visual storytelling

Format each suggestion as a clear, concise bullet point.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    const suggestions = completion.choices[0].message.content
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.trim().replace(/^[-•]\s*/, ''));

    res.json({ suggestions });
  } catch (error) {
    console.error('AI suggestion error:', error);
    res.status(500).json({ message: 'Failed to generate suggestions' });
  }
});

// Generate storyboard ideas
router.post('/storyboard-ideas', async (req, res) => {
  try {
    const { sceneDescription, genre } = req.body;

    const prompt = `As a professional cinematographer and storyboard artist, provide detailed visual suggestions for this scene:

Scene: ${sceneDescription}
Genre: ${genre || 'Drama'}

Please suggest:
1. Shot types and camera angles
2. Lighting setup
3. Composition and framing
4. Camera movement
5. Visual style elements

Format your response as a structured storyboard note.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.8
    });

    res.json({
      ideas: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Storyboard ideas error:', error);
    res.status(500).json({ message: 'Failed to generate storyboard ideas' });
  }
});

module.exports = router;
