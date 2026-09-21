const Concept = require('../models/Concept');
const Prerequisite = require('../models/Prerequisite');
const Mastery = require('../models/Mastery');
const Response = require('../models/Response');
const BKTEngine = require('./bktEngine');

class KnowledgeGraphService {
  /**
   * Fetches and builds full knowledge graph for a given student with mastery & dependency states
   * @param {string} studentId 
   */
  static async getStudentGraph(studentId) {
    const concepts = await Concept.find().sort({ orderIndex: 1 }).lean();
    const prerequisites = await Prerequisite.find().lean();
    const masteries = await Mastery.find({ studentId }).lean();
    const responses = await Response.find({ studentId }).sort({ timestamp: -1 }).limit(100).lean();

    const masteryMap = new Map();
    for (const m of masteries) {
      masteryMap.set(m.conceptId.toString(), m);
    }

    // Build lookup maps by slug and ID
    const conceptBySlug = new Map();
    const conceptById = new Map();
    for (const c of concepts) {
      conceptBySlug.set(c.slug, c);
      conceptById.set(c._id.toString(), c);
    }

    // Map prerequisites and dependents
    // In DB: { sourceConcept: 'linear_equations', prerequisiteConcept: 'fractions' }
    // Meaning: To learn sourceConcept, you need prerequisiteConcept.
    // Edge in visual graph: Prerequisite -> Source (Directed flow: Fractions -> Linear Equations)
    const prereqMap = new Map(); // conceptId -> array of prereq conceptIds
    const dependentMap = new Map(); // conceptId -> array of dependent conceptIds

    for (const c of concepts) {
      prereqMap.set(c._id.toString(), []);
      dependentMap.set(c._id.toString(), []);
    }

    for (const p of prerequisites) {
      const source = conceptBySlug.get(p.sourceConcept);
      const prereq = conceptBySlug.get(p.prerequisiteConcept);

      if (source && prereq) {
        prereqMap.get(source._id.toString())?.push({
          id: prereq._id.toString(),
          name: prereq.name,
          slug: prereq.slug,
          strength: p.strength,
        });
        dependentMap.get(prereq._id.toString())?.push({
          id: source._id.toString(),
          name: source.name,
          slug: source.slug,
        });
      }
    }

    // Calculate recent accuracy per concept
    const accuracyMap = new Map();
    for (const r of responses) {
      const cid = r.conceptId.toString();
      if (!accuracyMap.has(cid)) {
        accuracyMap.set(cid, { total: 0, correct: 0 });
      }
      const acc = accuracyMap.get(cid);
      acc.total += 1;
      if (r.correct) acc.correct += 1;
    }

    // Build Graph Nodes for React Flow
    // Graph layout positions:
    // Tier 1 (bottom/foundational): Number System (0, 300)
    // Tier 2: Fractions (-150, 200), Algebra (150, 200)
    // Tier 3: Linear Equations (0, 100)
    // Tier 4: Functions (-150, 0), Quadratic Equations (150, 0)
    const predefinedPositions = {
      number_system: { x: 250, y: 360 },
      fractions: { x: 100, y: 240 },
      algebraic_expressions: { x: 400, y: 240 },
      linear_equations: { x: 250, y: 120 },
      functions: { x: 100, y: 0 },
      quadratic_equations: { x: 400, y: 0 },
    };

    const nodes = concepts.map((c, index) => {
      const cid = c._id.toString();
      const masteryDoc = masteryMap.get(cid);
      const probability = masteryDoc ? masteryDoc.probability : 0.0;
      const status = BKTEngine.getMasteryStatus(probability);

      const accInfo = accuracyMap.get(cid) || { total: 0, correct: 0 };
      const accuracyRate = accInfo.total > 0 ? Math.round((accInfo.correct / accInfo.total) * 100) : null;

      const pos = predefinedPositions[c.slug] || {
        x: (index % 3) * 250 + 50,
        y: Math.floor(index / 3) * 140,
      };

      return {
        id: cid,
        type: 'conceptNode',
        position: pos,
        data: {
          id: cid,
          slug: c.slug,
          name: c.name,
          description: c.description,
          difficulty: c.difficulty,
          masteryThreshold: c.masteryThreshold,
          mastery: probability,
          masteryPercent: Math.round(probability * 100),
          status, // 'mastered' | 'learning' | 'weak' | 'not_started'
          prerequisites: prereqMap.get(cid) || [],
          dependents: dependentMap.get(cid) || [],
          recentAccuracy: accuracyRate,
          totalAttempts: accInfo.total,
          currentDifficulty: masteryDoc?.currentDifficulty || c.difficulty,
        },
      };
    });

    // Build Graph Edges for React Flow
    // Source -> Target represents prerequisite relationship: Prerequisite -> Next Concept
    const edges = [];
    for (const p of prerequisites) {
      const source = conceptBySlug.get(p.prerequisiteConcept);
      const target = conceptBySlug.get(p.sourceConcept);

      if (source && target) {
        const sourceMastery = masteryMap.get(source._id.toString())?.probability ?? 0;
        const isPrereqWeak = sourceMastery < 0.50;

        edges.push({
          id: `edge-${source.slug}-${target.slug}`,
          source: source._id.toString(),
          target: target._id.toString(),
          animated: isPrereqWeak,
          style: {
            stroke: isPrereqWeak ? '#ef4444' : '#6366f1',
            strokeWidth: isPrereqWeak ? 2.5 : 2,
            strokeDasharray: isPrereqWeak ? '5,5' : undefined,
          },
          label: isPrereqWeak ? 'Gap Vulnerability' : 'Prerequisite',
          labelStyle: { fill: isPrereqWeak ? '#ef4444' : '#64748b', fontSize: 11, fontWeight: 600 },
        });
      }
    }

    return {
      nodes,
      edges,
      concepts,
    };
  }
}

module.exports = KnowledgeGraphService;
