const mongoose = require('mongoose');

const prerequisiteSchema = new mongoose.Schema({
  sourceConcept: {
    type: String, // concept slug or name, e.g. "linear_equations"
    required: true,
    index: true,
  },
  prerequisiteConcept: {
    type: String, // foundational prerequisite slug or name, e.g. "fractions"
    required: true,
    index: true,
  },
  strength: {
    type: Number,
    default: 1.0,
  },
});

module.exports = mongoose.model('Prerequisite', prerequisiteSchema);
