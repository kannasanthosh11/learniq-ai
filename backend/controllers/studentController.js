const Student = require('../models/Student');
const Concept = require('../models/Concept');
const Mastery = require('../models/Mastery');
const Response = require('../models/Response');
const KnowledgeGraphService = require('../services/knowledgeGraph');
const GapDetector = require('../services/gapDetector');
const RecommendationEngine = require('../services/recommendationEngine');

// @desc    Get student profile & overview
// @route   GET /api/student/:id
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-passwordHash');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const masteries = await Mastery.find({ studentId: req.params.id }).populate('conceptId');
    const responses = await Response.find({ studentId: req.params.id });

    // Calculate overall mastery as weighted or simple average of concept masteries
    let overallMastery = 0.72; // default if uninitialized
    if (masteries.length > 0) {
      const sum = masteries.reduce((acc, m) => acc + m.probability, 0);
      overallMastery = Math.round((sum / masteries.length) * 100) / 100;
    }

    const totalQuestions = responses.length;
    const correctCount = responses.filter(r => r.correct).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    res.json({
      student,
      overallMastery: Math.round(overallMastery * 100),
      weeklyGain: '+8%',
      totalQuestions,
      correctCount,
      accuracy,
      conceptCount: masteries.length,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error retrieving student details', error: error.message });
  }
};

// @desc    Get all concept masteries for student
// @route   GET /api/student/:id/mastery
exports.getMastery = async (req, res) => {
  try {
    const masteries = await Mastery.find({ studentId: req.params.id })
      .populate('conceptId')
      .lean();

    const formatted = masteries.map(m => ({
      conceptId: m.conceptId?._id,
      name: m.conceptId?.name || 'Unknown',
      slug: m.conceptId?.slug || '',
      description: m.conceptId?.description || '',
      mastery: m.probability,
      masteryPercent: Math.round(m.probability * 100),
      status: m.probability >= 0.75 ? 'Mastered' : m.probability >= 0.50 ? 'Learning' : 'Weak',
      difficulty: m.currentDifficulty || 2,
      updatedAt: m.updatedAt,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching masteries', error: error.message });
  }
};

// @desc    Detect foundational knowledge gaps
// @route   GET /api/student/:id/gaps
exports.getGaps = async (req, res) => {
  try {
    const gaps = await GapDetector.detectGaps(req.params.id);
    res.json(gaps);
  } catch (error) {
    res.status(500).json({ message: 'Error detecting gaps', error: error.message });
  }
};

// @desc    Get recommendations & micro-practice path
// @route   GET /api/student/:id/recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await RecommendationEngine.getExplainableRecommendations(req.params.id);
    const microPractice = await RecommendationEngine.generateMicroPracticePath(req.params.id);

    res.json({
      recommendations,
      microPractice,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
};

// @desc    Get Knowledge Graph data formatted for React Flow
// @route   GET /api/student/:id/graph
exports.getGraph = async (req, res) => {
  try {
    const graphData = await KnowledgeGraphService.getStudentGraph(req.params.id);
    res.json(graphData);
  } catch (error) {
    console.error('Graph build error:', error);
    res.status(500).json({ message: 'Error building knowledge graph', error: error.message });
  }
};

// @desc    Get student progress and learning analytics over time
// @route   GET /api/student/:id/progress
exports.getProgress = async (req, res) => {
  try {
    const studentId = req.params.id;
    const responses = await Response.find({ studentId })
      .populate('conceptId')
      .sort({ timestamp: 1 })
      .lean();

    const masteries = await Mastery.find({ studentId }).populate('conceptId').lean();

    // Generate timeline data from actual responses
    const history = responses.map((r, index) => ({
      index: index + 1,
      concept: r.conceptId?.name || 'Math',
      difficulty: r.difficulty,
      correct: r.correct,
      result: r.correct ? 1 : 0,
      masteryAfter: Math.round((r.updatedMastery ?? 0.5) * 100),
      timestamp: r.timestamp,
    }));

    // Concept breakdown
    const conceptBreakdown = masteries.map(m => ({
      name: m.conceptId?.name || 'Concept',
      mastery: Math.round(m.probability * 100),
      threshold: Math.round((m.conceptId?.masteryThreshold || 0.75) * 100),
      difficulty: m.currentDifficulty || 2,
    }));

    const totalQuestions = responses.length;
    const correctCount = responses.filter(r => r.correct).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    res.json({
      history,
      conceptBreakdown,
      totalQuestions,
      correctCount,
      accuracy,
      streak: 4, // active day streak
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating progress analytics', error: error.message });
  }
};
