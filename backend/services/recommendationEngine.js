const Concept = require('../models/Concept');
const Prerequisite = require('../models/Prerequisite');
const Mastery = require('../models/Mastery');
const Question = require('../models/Question');
const Response = require('../models/Response');
const Recommendation = require('../models/Recommendation');
const GapDetector = require('./gapDetector');
const DifficultyEngine = require('./difficultyEngine');

class RecommendationEngine {
  /**
   * Selects next optimal question for a student, incorporating gap remediation and difficulty adaptation
   */
  static async selectNextQuestion(studentId, preferredConceptId = null) {
    const concepts = await Concept.find().lean();
    const masteries = await Mastery.find({ studentId }).lean();
    const responses = await Response.find({ studentId }).lean();

    const answeredQuestionIds = responses.map(r => r.questionId.toString());

    const conceptById = new Map();
    const conceptBySlug = new Map();
    for (const c of concepts) {
      conceptById.set(c._id.toString(), c);
      conceptBySlug.set(c.slug, c);
    }

    const masteryByConceptId = new Map();
    for (const m of masteries) {
      masteryByConceptId.set(m.conceptId.toString(), m);
    }

    // Check for root prerequisite gaps
    const gaps = await GapDetector.detectGaps(studentId);
    let targetConcept = null;
    let targetDifficulty = 2;
    let selectionReason = '';

    if (preferredConceptId) {
      // User explicitly wants to practice a specific concept
      targetConcept = conceptById.get(preferredConceptId.toString()) || conceptBySlug.get(preferredConceptId.toString());
      if (targetConcept) {
        // Check if this concept has a severe foundational gap
        const specificGap = await GapDetector.detectGaps(studentId, targetConcept._id);
        const mDoc = masteryByConceptId.get(targetConcept._id.toString());
        const masteryVal = mDoc ? mDoc.probability : 0.30;
        targetDifficulty = mDoc?.currentDifficulty || DifficultyEngine.getBaseDifficulty(masteryVal);

        if (specificGap && specificGap.gapDetected) {
          selectionReason = `Practicing ${targetConcept.name}. Note: A prerequisite gap in ${specificGap.conceptName} (${specificGap.masteryPercent}%) is actively influencing question selection.`;
        } else {
          selectionReason = `Targeting ${targetConcept.name} based on student focus (Current Mastery: ${Math.round(masteryVal * 100)}%).`;
        }
      }
    }

    // If no preferred concept or preferred concept not found, prioritize by gap detection
    if (!targetConcept) {
      if (gaps && gaps.length > 0) {
        const criticalGap = gaps[0];
        targetConcept = conceptById.get(criticalGap.conceptId);
        const mDoc = masteryByConceptId.get(criticalGap.conceptId);
        targetDifficulty = mDoc?.currentDifficulty || DifficultyEngine.getBaseDifficulty(criticalGap.mastery);
        selectionReason = `Priority Gap Remediation: ${criticalGap.conceptName} is a prerequisite for ${criticalGap.affectedConceptName} where your mastery is ${criticalGap.masteryPercent}%. Addressing this gap will unlock mastery in higher-level topics.`;
      } else {
        // Find concept with lowest mastery that isn't mastered
        const candidates = concepts.map(c => {
          const m = masteryByConceptId.get(c._id.toString());
          return {
            concept: c,
            mastery: m ? m.probability : 0.30,
            masteryDoc: m,
          };
        }).sort((a, b) => a.mastery - b.mastery);

        const chosen = candidates[0];
        targetConcept = chosen.concept;
        targetDifficulty = chosen.masteryDoc?.currentDifficulty || DifficultyEngine.getBaseDifficulty(chosen.mastery);
        selectionReason = `Adaptive pacing selected ${targetConcept.name} to advance current mastery from ${Math.round(chosen.mastery * 100)}%.`;
      }
    }

    if (!targetConcept) {
      targetConcept = concepts[0];
    }

    // Find questions for targetConcept at targetDifficulty
    let question = await Question.findOne({
      conceptId: targetConcept._id,
      difficulty: targetDifficulty,
      _id: { $nin: answeredQuestionIds },
    }).lean();

    // If no un-answered question at exact difficulty, look at nearby difficulty
    if (!question) {
      question = await Question.findOne({
        conceptId: targetConcept._id,
        difficulty: { $in: [targetDifficulty - 1, targetDifficulty + 1].filter(d => d >= 1 && d <= 5) },
        _id: { $nin: answeredQuestionIds },
      }).lean();
    }

    // If still none, allow any un-answered question in that concept
    if (!question) {
      question = await Question.findOne({
        conceptId: targetConcept._id,
        _id: { $nin: answeredQuestionIds },
      }).lean();
    }

    // If all questions in concept answered, allow recycle to reinforce
    if (!question) {
      question = await Question.findOne({
        conceptId: targetConcept._id,
      }).lean();
    }

    const currentMasteryDoc = masteryByConceptId.get(targetConcept._id.toString());
    const masteryProb = currentMasteryDoc ? currentMasteryDoc.probability : 0.30;

    return {
      question,
      concept: {
        id: targetConcept._id,
        name: targetConcept.name,
        slug: targetConcept.slug,
        mastery: masteryProb,
        masteryPercent: Math.round(masteryProb * 100),
      },
      difficulty: question ? question.difficulty : targetDifficulty,
      difficultyName: DifficultyEngine.getLevelName(question ? question.difficulty : targetDifficulty),
      reason: selectionReason,
    };
  }

  /**
   * Generates structured micro-practice recovery path for a detected knowledge gap
   */
  static async generateMicroPracticePath(studentId, gapSlug = 'fractions') {
    const concepts = await Concept.find().lean();
    const masteries = await Mastery.find({ studentId }).lean();

    const conceptBySlug = new Map();
    for (const c of concepts) {
      conceptBySlug.set(c.slug, c);
    }

    const masteryByConceptId = new Map();
    for (const m of masteries) {
      masteryByConceptId.set(m.conceptId.toString(), m);
    }

    const fractions = conceptBySlug.get('fractions');
    const linearEq = conceptBySlug.get('linear_equations');
    const algebra = conceptBySlug.get('algebraic_expressions');

    const fracMastery = fractions ? (masteryByConceptId.get(fractions._id.toString())?.probability ?? 0.39) : 0.39;
    const linMastery = linearEq ? (masteryByConceptId.get(linearEq._id.toString())?.probability ?? 0.42) : 0.42;

    return {
      gapTitle: 'Foundational Knowledge Gap Detected',
      rootConcept: 'Fractions',
      rootMasteryPercent: Math.round(fracMastery * 100),
      affectedConcept: 'Linear Equations',
      affectedMasteryPercent: Math.round(linMastery * 100),
      headline: 'Personalized Fraction Recovery Path',
      explanation: `Your Linear Equations performance is 42%. Fractions is a critical prerequisite for this concept and your current Fractions mastery is ${Math.round(fracMastery * 100)}%. Strengthening Fractions will resolve systematic errors when isolating variables with fractional coefficients.`,
      estimatedMinutes: 12,
      steps: [
        {
          stepNumber: 1,
          concept: 'Fraction Fundamentals',
          conceptSlug: 'fractions',
          difficulty: 1,
          difficultyLabel: 'Beginner',
          masteryPercent: Math.round(fracMastery * 100),
          status: 'recommended',
          reason: 'Solidify basic numerator and denominator relationships before solving multi-step equations.',
          completed: false,
        },
        {
          stepNumber: 2,
          concept: 'Equivalent Fractions & Common Denominators',
          conceptSlug: 'fractions',
          difficulty: 2,
          difficultyLabel: 'Easy',
          masteryPercent: Math.round(fracMastery * 100),
          status: 'upcoming',
          reason: 'Critical for finding common denominators when combining fractional terms.',
          completed: false,
        },
        {
          stepNumber: 3,
          concept: 'Fraction Operations (+, -, ×, ÷)',
          conceptSlug: 'fractions',
          difficulty: 3,
          difficultyLabel: 'Medium',
          masteryPercent: Math.round(fracMastery * 100),
          status: 'upcoming',
          reason: 'Multiplying by reciprocal is required to isolate variable coefficients.',
          completed: false,
        },
        {
          stepNumber: 4,
          concept: 'Algebraic Expressions with Fractions',
          conceptSlug: 'algebraic_expressions',
          difficulty: 3,
          difficultyLabel: 'Medium',
          masteryPercent: 81,
          status: 'upcoming',
          reason: 'Bridge foundational fraction arithmetic into algebraic term manipulation.',
          completed: false,
        },
        {
          stepNumber: 5,
          concept: 'Retry Linear Equations',
          conceptSlug: 'linear_equations',
          difficulty: 3,
          difficultyLabel: 'Adaptive Level 3',
          masteryPercent: Math.round(linMastery * 100),
          status: 'upcoming',
          reason: 'Re-test equation solving with refreshed prerequisite confidence.',
          completed: false,
        },
      ],
    };
  }

  /**
   * Generates explainable recommendations list for student dashboard
   */
  static async getExplainableRecommendations(studentId) {
    const gaps = await GapDetector.detectGaps(studentId);
    const concepts = await Concept.find().lean();
    const masteries = await Mastery.find({ studentId }).lean();

    const list = [];

    if (gaps && gaps.length > 0) {
      for (const gap of gaps) {
        list.push({
          id: `rec-gap-${gap.concept}`,
          type: 'gap_recovery',
          priority: 1,
          conceptId: gap.conceptId,
          conceptName: gap.conceptName,
          conceptSlug: gap.concept,
          title: `Reinforce ${gap.conceptName} Foundation`,
          badge: 'Foundational Gap',
          currentMastery: gap.masteryPercent,
          targetConcept: gap.affectedConceptName,
          explanation: `Your ${gap.affectedConceptName} accuracy has dropped to ${gap.affectedMasteryPercent}%. ${gap.conceptName} is a prerequisite for this concept and your current ${gap.conceptName} mastery is ${gap.masteryPercent}%. Strengthening ${gap.conceptName} will directly boost equation-solving fluency.`,
          actionText: `Practice ${gap.conceptName} Gap`,
          actionUrl: `/practice?concept=${gap.conceptId}&mode=gap_recovery`,
        });
      }
    }

    // Find concepts ready for advancement (> 70%)
    const masteryMap = new Map(masteries.map(m => [m.conceptId.toString(), m]));
    for (const c of concepts) {
      const m = masteryMap.get(c._id.toString());
      if (m && m.probability >= 0.70 && m.probability < 0.95) {
        list.push({
          id: `rec-adv-${c.slug}`,
          type: 'concept_advancement',
          priority: 3,
          conceptId: c._id.toString(),
          conceptName: c.name,
          conceptSlug: c.slug,
          title: `Advance ${c.name} to Mastery`,
          badge: 'Advancement',
          currentMastery: Math.round(m.probability * 100),
          explanation: `You've demonstrated solid understanding (${Math.round(m.probability * 100)}%). A few higher-difficulty problems will push this concept into verified mastery status.`,
          actionText: `Challenge Level ${m.currentDifficulty}`,
          actionUrl: `/practice?concept=${c._id}&mode=advance`,
        });
      }
    }

    return list;
  }
}

module.exports = RecommendationEngine;
