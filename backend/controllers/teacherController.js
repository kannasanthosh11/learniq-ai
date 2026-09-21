const Student = require('../models/Student');
const Concept = require('../models/Concept');
const Mastery = require('../models/Mastery');
const Response = require('../models/Response');
const GapDetector = require('../services/gapDetector');

// @desc    Get all students with mastery overviews for teacher dashboard
// @route   GET /api/teacher/students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ role: 'student' }).select('-passwordHash').lean();
    const concepts = await Concept.find().lean();
    const allMasteries = await Mastery.find().populate('conceptId').lean();

    const studentMetrics = [];

    for (const student of students) {
      const studentId = student._id.toString();
      const sMasteries = allMasteries.filter(m => m.studentId.toString() === studentId);

      let avgMastery = 0.50;
      let lowestConcept = 'None';
      let lowestMastery = 1.0;

      if (sMasteries.length > 0) {
        const sum = sMasteries.reduce((acc, m) => acc + m.probability, 0);
        avgMastery = sum / sMasteries.length;

        for (const m of sMasteries) {
          if (m.probability < lowestMastery) {
            lowestMastery = m.probability;
            lowestConcept = m.conceptId?.name || 'Unknown';
          }
        }
      }

      // Detect gaps
      const gaps = await GapDetector.detectGaps(studentId);

      let status = 'On Track';
      if (avgMastery < 0.60 || gaps.length > 0) {
        status = lowestMastery < 0.40 ? 'Needs Attention' : 'Needs Practice';
      } else if (avgMastery >= 0.80) {
        status = 'Advanced';
      }

      studentMetrics.push({
        _id: student._id,
        name: student.name,
        email: student.email,
        mastery: Math.round(avgMastery * 100),
        weakConcept: gaps.length > 0 ? gaps[0].conceptName : lowestConcept,
        status,
        gapCount: gaps.length,
        criticalGap: gaps.length > 0 ? gaps[0] : null,
      });
    }

    // Dashboard overall statistics
    const totalStudents = students.length;
    const avgCohortMastery = studentMetrics.length > 0
      ? Math.round(studentMetrics.reduce((acc, s) => acc + s.mastery, 0) / studentMetrics.length)
      : 70;
    const needingAttention = studentMetrics.filter(s => s.status.includes('Attention') || s.status.includes('Practice')).length;

    res.json({
      totalStudents,
      avgCohortMastery,
      needingAttention,
      students: studentMetrics,
    });
  } catch (error) {
    console.error('Teacher students fetch error:', error);
    res.status(500).json({ message: 'Error retrieving teacher cohort data', error: error.message });
  }
};

// @desc    Get detailed individual student performance for teacher view
// @route   GET /api/teacher/student/:id
exports.getStudentDetails = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-passwordHash');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const masteries = await Mastery.find({ studentId: req.params.id }).populate('conceptId').lean();
    const responses = await Response.find({ studentId: req.params.id }).sort({ timestamp: -1 }).populate('conceptId').lean();
    const gaps = await GapDetector.detectGaps(req.params.id);

    const totalResponses = responses.length;
    const correctCount = responses.filter(r => r.correct).length;
    const accuracy = totalResponses > 0 ? Math.round((correctCount / totalResponses) * 100) : 0;

    res.json({
      student,
      masteries: masteries.map(m => ({
        concept: m.conceptId?.name,
        mastery: Math.round(m.probability * 100),
        difficulty: m.currentDifficulty,
        consecutiveCorrect: m.consecutiveCorrect,
      })),
      gaps,
      recentResponses: responses.slice(0, 15),
      totalResponses,
      accuracy,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student details', error: error.message });
  }
};

// @desc    Get concept analytics and difficulty distribution across cohort
// @route   GET /api/teacher/concepts
exports.getConceptAnalytics = async (req, res) => {
  try {
    const concepts = await Concept.find().lean();
    const allMasteries = await Mastery.find().lean();
    const responses = await Response.find().lean();

    const conceptStats = concepts.map(c => {
      const cMasteries = allMasteries.filter(m => m.conceptId.toString() === c._id.toString());
      const cResponses = responses.filter(r => r.conceptId.toString() === c._id.toString());

      const avgMastery = cMasteries.length > 0
        ? Math.round((cMasteries.reduce((a, b) => a + b.probability, 0) / cMasteries.length) * 100)
        : 50;

      const correctCount = cResponses.filter(r => r.correct).length;
      const accuracy = cResponses.length > 0
        ? Math.round((correctCount / cResponses.length) * 100)
        : 65;

      const difficultyRating = avgMastery < 45 ? 'High Difficulty' : avgMastery < 70 ? 'Moderate Difficulty' : 'Low Difficulty';

      return {
        conceptId: c._id,
        name: c.name,
        slug: c.slug,
        baseDifficulty: c.difficulty,
        avgMastery,
        accuracy,
        totalAttempts: cResponses.length,
        difficultyRating,
      };
    });

    res.json(conceptStats);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving concept analytics', error: error.message });
  }
};
