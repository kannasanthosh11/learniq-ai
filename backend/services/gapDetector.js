const Concept = require('../models/Concept');
const Prerequisite = require('../models/Prerequisite');
const Mastery = require('../models/Mastery');
const Response = require('../models/Response');

class GapDetector {
  /**
   * Detects root knowledge gaps for a specific concept or across all concepts for a student
   * @param {string} studentId
   * @param {string} [conceptId] - Optional specific concept ID or slug
   */
  static async detectGaps(studentId, conceptId = null) {
    // 1. Fetch concepts, prerequisites, and student masteries
    const concepts = await Concept.find().lean();
    const prerequisites = await Prerequisite.find().lean();
    const masteries = await Mastery.find({ studentId }).lean();
    const responses = await Response.find({ studentId }).sort({ timestamp: -1 }).limit(20).lean();

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

    // Check specific concept or all concepts
    let targetConcepts = [];
    if (conceptId) {
      const target = conceptById.get(conceptId.toString()) || conceptBySlug.get(conceptId.toString());
      if (target) targetConcepts.push(target);
    } else {
      // Look at all concepts where student mastery is below threshold (e.g. < 0.60)
      targetConcepts = concepts.filter(c => {
        const m = masteryByConceptId.get(c._id.toString());
        return m && m.probability < 0.65;
      });
    }

    const detectedGaps = [];

    for (const target of targetConcepts) {
      const targetMasteryDoc = masteryByConceptId.get(target._id.toString());
      const targetMastery = targetMasteryDoc ? targetMasteryDoc.probability : 0.30;

      // Find prerequisites for this target concept (sourceConcept in Prerequisite model)
      const targetPrereqs = prerequisites.filter(p => p.sourceConcept === target.slug);

      if (targetPrereqs.length === 0) continue;

      // Check each prerequisite's mastery
      const weakPrereqs = [];
      for (const p of targetPrereqs) {
        const prereqConcept = conceptBySlug.get(p.prerequisiteConcept);
        if (!prereqConcept) continue;

        const pMasteryDoc = masteryByConceptId.get(prereqConcept._id.toString());
        const pMastery = pMasteryDoc ? pMasteryDoc.probability : 0.30;

        // A prerequisite is considered a gap if its mastery is low (< 0.55)
        // or significantly lower than the target concept
        if (pMastery < 0.60) {
          // Analyze recent incorrect responses in target concept
          const recentTargetErrors = responses.filter(
            r => r.conceptId.toString() === target._id.toString() && !r.correct
          ).length;

          weakPrereqs.push({
            prereqConcept,
            mastery: pMastery,
            strength: p.strength,
            recentTargetErrors,
          });
        }
      }

      // Sort weak prerequisites by lowest mastery first, then strength
      weakPrereqs.sort((a, b) => a.mastery - b.mastery);

      if (weakPrereqs.length > 0) {
        const rootWeakness = weakPrereqs[0];
        const rootConcept = rootWeakness.prereqConcept;

        detectedGaps.push({
          gapDetected: true,
          conceptId: rootConcept._id.toString(),
          conceptName: rootConcept.name,
          concept: rootConcept.slug,
          mastery: rootWeakness.mastery,
          masteryPercent: Math.round(rootWeakness.mastery * 100),
          affectedConceptId: target._id.toString(),
          affectedConceptName: target.name,
          affectedConcept: target.slug,
          affectedMastery: targetMastery,
          affectedMasteryPercent: Math.round(targetMastery * 100),
          reason: `${rootConcept.name} is a foundational prerequisite for ${target.name}. Your recent errors suggest that foundational ${rootConcept.name.toLowerCase()} understanding is impeding your ${target.name.toLowerCase()} problem solving.`,
          recommendedAction: `Complete ${rootConcept.name} Recovery Micro-Practice Path before attempting advanced ${target.name} problems.`,
          priority: rootWeakness.mastery < 0.40 ? 'critical' : 'moderate',
        });
      }
    }

    if (conceptId) {
      return detectedGaps.length > 0
        ? detectedGaps[0]
        : {
            gapDetected: false,
            concept: conceptId,
            reason: 'No foundational prerequisite gaps detected for this concept.',
          };
    }

    return detectedGaps;
  }
}

module.exports = GapDetector;
