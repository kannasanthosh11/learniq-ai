const AIAnalysisEngine = require('../services/aiAnalysisEngine');
const Student = require('../models/Student');
const Mastery = require('../models/Mastery');
const Response = require('../models/Response');

// @desc    Analyze student's genuine performance using AI API key
// @route   POST /api/ai/analyze-profile
exports.analyzeProfile = async (req, res) => {
  try {
    const studentId = req.body.studentId || req.user?._id;
    if (!studentId) {
      return res.status(400).json({ message: 'studentId required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const masteries = await Mastery.find({ studentId }).populate('conceptId').lean();
    const responses = await Response.find({ studentId }).sort({ timestamp: -1 }).limit(30).lean();

    const analysis = await AIAnalysisEngine.analyzeOverallStudentProfile(student, masteries, responses);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing profile:', error);
    res.status(500).json({ message: 'AI Analysis Error', error: error.message });
  }
};

// @desc    Set or update Gemini/OpenAI API key in runtime
// @route   POST /api/ai/set-key
exports.setApiKey = async (req, res) => {
  try {
    const { apiKey, provider } = req.body;
    if (!apiKey) {
      return res.status(400).json({ message: 'API key is required' });
    }

    if (provider === 'openai') {
      process.env.OPENAI_API_KEY = apiKey.trim();
    } else {
      process.env.GEMINI_API_KEY = apiKey.trim();
      process.env.AI_API_KEY = apiKey.trim();
    }

    res.json({
      message: 'AI API Key successfully configured and activated!',
      provider: provider || 'gemini',
      keyPreview: `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update API key', error: error.message });
  }
};

// @desc    Check status of AI API key
// @route   GET /api/ai/status
exports.getAiStatus = async (req, res) => {
  const gemini = Boolean(process.env.GEMINI_API_KEY || process.env.AI_API_KEY);
  const openai = Boolean(process.env.OPENAI_API_KEY);

  res.json({
    active: gemini || openai,
    provider: gemini ? 'Google Gemini' : openai ? 'OpenAI' : 'None (BKT Algorithmic)',
    geminiConfigured: gemini,
    openaiConfigured: openai,
  });
};
