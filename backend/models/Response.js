const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  conceptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Concept',
    required: true,
    index: true,
  },
  correct: {
    type: Boolean,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  selectedAnswer: {
    type: String,
  },
  previousMastery: {
    type: Number,
  },
  updatedMastery: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Response', responseSchema);
