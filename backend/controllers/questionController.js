const Question = require('../models/Question');
const Concept = require('../models/Concept');
const Mastery = require('../models/Mastery');
const Response = require('../models/Response');
const Student = require('../models/Student');
const BKTEngine = require('../services/bktEngine');
const DifficultyEngine = require('../services/difficultyEngine');
const GapDetector = require('../services/gapDetector');
const RecommendationEngine = require('../services/recommendationEngine');
const AIAnalysisEngine = require('../services/aiAnalysisEngine');

// @desc    Get next adaptive question for student
// @route   GET /api/questions/next
exports.getNextQuestion = async (req, res) => {
  try {
    const studentId = req.query.studentId || req.user?._id;
    const conceptId = req.query.conceptId || req.query.concept;

    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required' });
    }

    const nextSelection = await RecommendationEngine.selectNextQuestion(studentId, conceptId);

    if (!nextSelection.question) {
      return res.status(404).json({ message: 'No questions currently available for this selection criteria' });
    }

    res.json({
      question: {
        _id: nextSelection.question._id,
        question: nextSelection.question.question,
        options: nextSelection.question.options,
        difficulty: nextSelection.question.difficulty,
        conceptId: nextSelection.concept.id,
        conceptName: nextSelection.concept.name,
        conceptSlug: nextSelection.concept.slug,
        hint: nextSelection.question.hint,
      },
      concept: nextSelection.concept,
      difficulty: nextSelection.difficulty,
      difficultyName: nextSelection.difficultyName,
      reason: nextSelection.reason,
    });
  } catch (error) {
    console.error('Error fetching next question:', error);
    res.status(500).json({ message: 'Error selecting next question', error: error.message });
  }
};

// @desc    Submit answer, run BKT update, adapt difficulty & execute real AI API cognitive analysis
// @route   POST /api/questions/:id/answer
exports.answerQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { studentId, selectedAnswer } = req.body;

    const actualStudentId = studentId || req.user?._id;

    if (!actualStudentId || selectedAnswer === undefined) {
      return res.status(400).json({ message: 'studentId and selectedAnswer are required' });
    }

    const question = await Question.findById(questionId).populate('conceptId');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const student = await Student.findById(actualStudentId);

    const isCorrect = (selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) ||
                      (selectedAnswer.trim().startsWith(question.correctAnswer.trim()));

    // 1. Fetch current mastery record or initialize
    let masteryDoc = await Mastery.findOne({
      studentId: actualStudentId,
      conceptId: question.conceptId._id,
    });

    if (!masteryDoc) {
      masteryDoc = new Mastery({
        studentId: actualStudentId,
        conceptId: question.conceptId._id,
        probability: 0.20,
        currentDifficulty: question.difficulty || 2,
        consecutiveCorrect: 0,
        consecutiveIncorrect: 0,
      });
    }

    const priorMastery = masteryDoc.probability;

    // 2. Execute REAL Bayesian Knowledge Tracing (BKT) calculation
    const bktResult = BKTEngine.updateMastery(priorMastery, isCorrect, {
      pTransition: masteryDoc.pTransition,
      pGuess: masteryDoc.pGuess,
      pSlip: masteryDoc.pSlip,
    });

    // 3. Update consecutive streaks
    if (isCorrect) {
      masteryDoc.consecutiveCorrect += 1;
      masteryDoc.consecutiveIncorrect = 0;
    } else {
      masteryDoc.consecutiveIncorrect += 1;
      masteryDoc.consecutiveCorrect = 0;
    }

    // 4. Run Dynamic Difficulty Engine
    const gapAnalysis = await GapDetector.detectGaps(actualStudentId, question.conceptId._id);
    const prereqMastery = gapAnalysis?.gapDetected ? gapAnalysis.mastery : 1.0;

    const difficultyAdaptation = DifficultyEngine.adaptDifficulty({
      currentMastery: bktResult.newMastery,
      currentDifficulty: masteryDoc.currentDifficulty || question.difficulty,
      consecutiveCorrect: masteryDoc.consecutiveCorrect,
      consecutiveIncorrect: masteryDoc.consecutiveIncorrect,
      lastAnswerCorrect: isCorrect,
      prereqMastery,
    });

    // 5. Update and persist mastery state in MongoDB
    masteryDoc.probability = bktResult.newMastery;
    masteryDoc.currentDifficulty = difficultyAdaptation.nextDifficulty;
    masteryDoc.updatedAt = new Date();
    await masteryDoc.save();

    // 6. Record response log in MongoDB
    const responseLog = await Response.create({
      studentId: actualStudentId,
      questionId: question._id,
      conceptId: question.conceptId._id,
      correct: isCorrect,
      difficulty: question.difficulty,
      selectedAnswer,
      previousMastery: priorMastery,
      updatedMastery: bktResult.newMastery,
      timestamp: new Date(),
    });

    // 7. Check if foundational gap was uncovered
    const fullGaps = await GapDetector.detectGaps(actualStudentId);
    const relevantGap = fullGaps.find(g => g.affectedConceptId === question.conceptId._id.toString());

    // 8. LIVE AI API SCORE & MISCONCEPTION ANALYSIS (Gemini / OpenAI API key powered)
    const aiScoreAnalysis = await AIAnalysisEngine.analyzeScoreResponse({
      studentName: student?.name || 'Student',
      conceptName: question.conceptId.name,
      currentMastery: priorMastery,
      newMastery: bktResult.newMastery,
      questionText: question.question,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      prerequisites: gapAnalysis?.gapDetected ? [gapAnalysis.conceptName] : [],
    });

    res.json({
      correct: isCorrect,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      concept: {
        id: question.conceptId._id,
        name: question.conceptId.name,
        slug: question.conceptId.slug,
      },
      bktUpdate: {
        previousMastery: bktResult.previousMastery,
        posteriorMastery: bktResult.posteriorMastery,
        newMastery: bktResult.newMastery,
        delta: bktResult.delta,
        percentBefore: Math.round(bktResult.previousMastery * 100),
        percentAfter: Math.round(bktResult.newMastery * 100),
        parameters: bktResult.parameters,
      },
      difficultyUpdate: difficultyAdaptation,
      gapDetected: Boolean(relevantGap),
      gapDetails: relevantGap || null,
      aiScoreAnalysis,
      responseId: responseLog._id,
    });
  } catch (error) {
    console.error('Error processing answer submission:', error);
    res.status(500).json({ message: 'Error processing question submission', error: error.message });
  }
};
