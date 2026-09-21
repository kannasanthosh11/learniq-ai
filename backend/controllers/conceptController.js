const Concept = require('../models/Concept');
const Prerequisite = require('../models/Prerequisite');

// @desc    Get all concepts with their prerequisites
// @route   GET /api/concepts
exports.getConcepts = async (req, res) => {
  try {
    const concepts = await Concept.find().sort({ orderIndex: 1 }).lean();
    const prerequisites = await Prerequisite.find().lean();

    const result = concepts.map(c => {
      const prereqs = prerequisites
        .filter(p => p.sourceConcept === c.slug)
        .map(p => p.prerequisiteConcept);

      return {
        ...c,
        prerequisites: prereqs,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving concepts', error: error.message });
  }
};

// @desc    Get single concept by ID or slug
// @route   GET /api/concepts/:id
exports.getConceptById = async (req, res) => {
  try {
    const { id } = req.params;
    let concept = null;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      concept = await Concept.findById(id).lean();
    } else {
      concept = await Concept.findOne({ slug: id.toLowerCase() }).lean();
    }

    if (!concept) {
      return res.status(404).json({ message: 'Concept not found' });
    }

    const prerequisites = await Prerequisite.find({ sourceConcept: concept.slug }).lean();

    res.json({
      ...concept,
      prerequisites: prerequisites.map(p => p.prerequisiteConcept),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving concept', error: error.message });
  }
};
