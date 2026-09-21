const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB } = require('../config/db');

const Student = require('../models/Student');
const Concept = require('../models/Concept');
const Prerequisite = require('../models/Prerequisite');
const Question = require('../models/Question');
const Mastery = require('../models/Mastery');
const Response = require('../models/Response');
const Recommendation = require('../models/Recommendation');

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Initializing LearnIQ Curriculum Bank (Real Score Tracking Mode)...');
    
    // Clear only concepts, prerequisites, and questions to refresh curriculum backbone
    // Do NOT create fake demo students or pre-seeded fake masteries
    await Concept.deleteMany({});
    await Prerequisite.deleteMany({});
    await Question.deleteMany({});

    console.log('Seeding Real Concepts Curriculum...');
    const concepts = await Concept.insertMany([
      {
        name: 'Number System',
        slug: 'number_system',
        description: 'Integers, rational numbers, operations on real numbers, and arithmetic foundations.',
        difficulty: 1,
        masteryThreshold: 0.75,
        category: 'Foundations',
        orderIndex: 1,
      },
      {
        name: 'Fractions',
        slug: 'fractions',
        description: 'Fraction arithmetic, equivalent fractions, common denominators, and reciprocal operations.',
        difficulty: 2,
        masteryThreshold: 0.75,
        category: 'Foundations',
        orderIndex: 2,
      },
      {
        name: 'Algebraic Expressions',
        slug: 'algebraic_expressions',
        description: 'Variables, coefficients, combining like terms, and expanding algebraic expressions.',
        difficulty: 2,
        masteryThreshold: 0.75,
        category: 'Algebra',
        orderIndex: 3,
      },
      {
        name: 'Linear Equations',
        slug: 'linear_equations',
        description: 'Solving one-variable and two-variable linear equations using inverse operations.',
        difficulty: 3,
        masteryThreshold: 0.75,
        category: 'Algebra',
        orderIndex: 4,
      },
      {
        name: 'Functions',
        slug: 'functions',
        description: 'Function notation, domain, range, linear mappings, and function composition.',
        difficulty: 4,
        masteryThreshold: 0.75,
        category: 'Advanced Algebra',
        orderIndex: 5,
      },
      {
        name: 'Quadratic Equations',
        slug: 'quadratic_equations',
        description: 'Second-degree polynomials, factoring, completing the square, and quadratic formula.',
        difficulty: 5,
        masteryThreshold: 0.75,
        category: 'Advanced Algebra',
        orderIndex: 6,
      },
    ]);

    const conceptMap = {};
    concepts.forEach(c => {
      conceptMap[c.slug] = c;
    });

    console.log('Seeding Prerequisites DAG...');
    await Prerequisite.insertMany([
      { sourceConcept: 'fractions', prerequisiteConcept: 'number_system', strength: 1.0 },
      { sourceConcept: 'algebraic_expressions', prerequisiteConcept: 'number_system', strength: 1.0 },
      { sourceConcept: 'linear_equations', prerequisiteConcept: 'fractions', strength: 0.95 },
      { sourceConcept: 'linear_equations', prerequisiteConcept: 'algebraic_expressions', strength: 1.0 },
      { sourceConcept: 'functions', prerequisiteConcept: 'linear_equations', strength: 0.90 },
      { sourceConcept: 'quadratic_equations', prerequisiteConcept: 'linear_equations', strength: 0.95 },
    ]);

    console.log('Seeding Authentic Question Bank (Levels 1 to 5)...');
    const questionData = [
      // --- FRACTIONS ---
      {
        conceptId: conceptMap['fractions']._id,
        conceptSlug: 'fractions',
        difficulty: 1,
        question: 'What is 1/4 + 2/4 in simplest form?',
        options: ['2/8', '3/4', '3/8', '1/2'],
        correctAnswer: '3/4',
        explanation: 'With like denominators (4), add the numerators: 1 + 2 = 3. The denominator remains 4, yielding 3/4.',
        hint: 'Since both fractions share the same denominator, add the top numbers directly.',
      },
      {
        conceptId: conceptMap['fractions']._id,
        conceptSlug: 'fractions',
        difficulty: 2,
        question: 'Find the sum: 1/2 + 1/3',
        options: ['2/5', '5/6', '3/6', '2/6'],
        correctAnswer: '5/6',
        explanation: 'Find a common denominator: LCM(2, 3) = 6. Convert: 1/2 = 3/6 and 1/3 = 2/6. 3/6 + 2/6 = 5/6.',
        hint: 'Find the least common multiple of 2 and 3 first.',
      },
      {
        conceptId: conceptMap['fractions']._id,
        conceptSlug: 'fractions',
        difficulty: 2,
        question: 'What is 3/5 - 1/4?',
        options: ['7/20', '2/1', '2/20', '1/10'],
        correctAnswer: '7/20',
        explanation: 'The common denominator is 20. 3/5 = 12/20 and 1/4 = 5/20. 12/20 - 5/20 = 7/20.',
        hint: 'Convert both fractions to have denominator 20.',
      },
      {
        conceptId: conceptMap['fractions']._id,
        conceptSlug: 'fractions',
        difficulty: 3,
        question: 'Multiply: (2/3) × (9/10)',
        options: ['3/5', '18/30', '11/13', '4/5'],
        correctAnswer: '3/5',
        explanation: 'Multiply numerators (2 × 9 = 18) and denominators (3 × 10 = 30). Simplify 18/30 by dividing numerator and denominator by 6: 3/5.',
        hint: 'Cancel out common factors before multiplying.',
      },
      {
        conceptId: conceptMap['fractions']._id,
        conceptSlug: 'fractions',
        difficulty: 3,
        question: 'Divide: (3/4) ÷ (2/5)',
        options: ['6/20', '15/8', '8/15', '5/6'],
        correctAnswer: '15/8',
        explanation: 'To divide by a fraction, multiply by its reciprocal: (3/4) × (5/2) = (3 × 5) / (4 × 2) = 15/8.',
        hint: 'Multiply the first fraction by the reciprocal (flip) of the second fraction.',
      },
      {
        conceptId: conceptMap['fractions']._id,
        conceptSlug: 'fractions',
        difficulty: 4,
        question: 'Simplify the compound fraction: ((1/2) + (1/4)) / (3/8)',
        options: ['1', '2', '3/2', '4/3'],
        correctAnswer: '2',
        explanation: 'Numerator: 1/2 + 1/4 = 3/4. Then divide: (3/4) / (3/8) = (3/4) * (8/3) = 24/12 = 2.',
        hint: 'Simplify the numerator first, then multiply by reciprocal of the denominator.',
      },
      {
        conceptId: conceptMap['fractions']._id,
        conceptSlug: 'fractions',
        difficulty: 5,
        question: 'Solve for x: (2/3)x + (1/2) = 5/6',
        options: ['x = 1/2', 'x = 2/3', 'x = 1', 'x = 3/4'],
        correctAnswer: 'x = 1/2',
        explanation: 'Subtract 1/2 from both sides: 5/6 - 3/6 = 2/6 = 1/3. Then (2/3)x = 1/3. Multiply both sides by 3/2: x = (1/3) * (3/2) = 1/2.',
        hint: 'Eliminate the constant fraction first, then multiply by the reciprocal of the coefficient.',
      },

      // --- ALGEBRAIC EXPRESSIONS ---
      {
        conceptId: conceptMap['algebraic_expressions']._id,
        conceptSlug: 'algebraic_expressions',
        difficulty: 1,
        question: 'Simplify by combining like terms: 3x + 5x',
        options: ['8x', '8x^2', '15x', '8'],
        correctAnswer: '8x',
        explanation: 'Both terms share variable factor x. Add coefficients: 3 + 5 = 8, giving 8x.',
        hint: 'Combine coefficients of identical variables.',
      },
      {
        conceptId: conceptMap['algebraic_expressions']._id,
        conceptSlug: 'algebraic_expressions',
        difficulty: 2,
        question: 'Simplify: 4a + 7b - 2a + 3b',
        options: ['2a + 10b', '6a + 10b', '12ab', '2a + 4b'],
        correctAnswer: '2a + 10b',
        explanation: 'Combine "a" terms: 4a - 2a = 2a. Combine "b" terms: 7b + 3b = 10b. Result: 2a + 10b.',
        hint: 'Group like terms with identical letters together.',
      },
      {
        conceptId: conceptMap['algebraic_expressions']._id,
        conceptSlug: 'algebraic_expressions',
        difficulty: 3,
        question: 'Expand the expression: 3(2x - 4)',
        options: ['6x - 12', '6x - 4', '5x - 7', '6x + 12'],
        correctAnswer: '6x - 12',
        explanation: 'Distribute: 3 * 2x = 6x, and 3 * (-4) = -12. Result = 6x - 12.',
        hint: 'Multiply the outer term by each term inside the parentheses.',
      },

      // --- LINEAR EQUATIONS ---
      {
        conceptId: conceptMap['linear_equations']._id,
        conceptSlug: 'linear_equations',
        difficulty: 1,
        question: 'Solve for x: x + 7 = 15',
        options: ['x = 8', 'x = 22', 'x = 7', 'x = 9'],
        correctAnswer: 'x = 8',
        explanation: 'Subtract 7 from both sides: x = 15 - 7 = 8.',
        hint: 'Use the inverse operation of addition (subtraction).',
      },
      {
        conceptId: conceptMap['linear_equations']._id,
        conceptSlug: 'linear_equations',
        difficulty: 2,
        question: 'Solve for x: 3x = 21',
        options: ['x = 7', 'x = 18', 'x = 63', 'x = 6'],
        correctAnswer: 'x = 7',
        explanation: 'Divide both sides by 3: x = 21 / 3 = 7.',
        hint: 'Divide by the coefficient of x.',
      },
      {
        conceptId: conceptMap['linear_equations']._id,
        conceptSlug: 'linear_equations',
        difficulty: 3,
        question: 'Solve: 2x + 6 = 14',
        options: ['x = 4', 'x = 5', 'x = 3', 'x = 10'],
        correctAnswer: 'x = 4',
        explanation: 'Step 1: Subtract 6 from both sides: 2x = 8. Step 2: Divide both sides by 2: x = 4.',
        hint: 'First isolate the variable term by subtracting the constant 6.',
      },
      {
        conceptId: conceptMap['linear_equations']._id,
        conceptSlug: 'linear_equations',
        difficulty: 3,
        question: 'Solve for y: 5y - 8 = 22',
        options: ['y = 6', 'y = 4', 'y = 7', 'y = 5'],
        correctAnswer: 'y = 6',
        explanation: 'Add 8 to both sides: 5y = 30. Divide by 5: y = 6.',
        hint: 'Add 8 to both sides, then divide by 5.',
      },
      {
        conceptId: conceptMap['linear_equations']._id,
        conceptSlug: 'linear_equations',
        difficulty: 4,
        question: 'Solve for x: (3/4)x - 2 = 7',
        options: ['x = 12', 'x = 9', 'x = 16', 'x = 10'],
        correctAnswer: 'x = 12',
        explanation: 'Add 2 to both sides: (3/4)x = 9. Multiply both sides by reciprocal 4/3: x = 9 * (4/3) = 36/3 = 12.',
        hint: 'Add 2, then multiply both sides by the reciprocal (4/3).',
      },
      {
        conceptId: conceptMap['linear_equations']._id,
        conceptSlug: 'linear_equations',
        difficulty: 5,
        question: 'Solve for x: (x + 2)/3 + (x - 1)/2 = 4',
        options: ['x = 23/5', 'x = 4.2', 'x = 5', 'x = 23/6'],
        correctAnswer: 'x = 23/5',
        explanation: 'Multiply entire equation by LCM 6: 2(x + 2) + 3(x - 1) = 24. Distribute: 2x + 4 + 3x - 3 = 24. 5x + 1 = 24. 5x = 23. x = 23/5.',
        hint: 'Multiply the entire equation by the common denominator 6 to clear all fractions.',
      },

      // --- NUMBER SYSTEM ---
      {
        conceptId: conceptMap['number_system']._id,
        conceptSlug: 'number_system',
        difficulty: 1,
        question: 'What is (-8) + 15?',
        options: ['7', '-7', '23', '-23'],
        correctAnswer: '7',
        explanation: 'Adding positive 15 to -8 moves 15 units right on the number line: 15 - 8 = 7.',
        hint: 'Think of 15 - 8.',
      },
      {
        conceptId: conceptMap['number_system']._id,
        conceptSlug: 'number_system',
        difficulty: 2,
        question: 'Evaluate: (-6) × (-4)',
        options: ['24', '-24', '10', '-10'],
        correctAnswer: '24',
        explanation: 'The product of two negative integers is always positive: (-6) * (-4) = +24.',
        hint: 'A negative number multiplied by a negative number results in a positive number.',
      },

      // --- FUNCTIONS ---
      {
        conceptId: conceptMap['functions']._id,
        conceptSlug: 'functions',
        difficulty: 3,
        question: 'If f(x) = 3x - 5, what is f(4)?',
        options: ['7', '12', '17', '2'],
        correctAnswer: '7',
        explanation: 'Substitute 4 for x: f(4) = 3(4) - 5 = 12 - 5 = 7.',
        hint: 'Plug in 4 wherever you see x.',
      },
      {
        conceptId: conceptMap['functions']._id,
        conceptSlug: 'functions',
        difficulty: 4,
        question: 'If f(x) = 2x + 1 and g(x) = x^2, what is f(g(3))?',
        options: ['19', '49', '18', '25'],
        correctAnswer: '19',
        explanation: 'First evaluate g(3) = 3^2 = 9. Then evaluate f(9) = 2(9) + 1 = 19.',
        hint: 'Evaluate the inner function g(3) first, then pass that value to f(x).',
      },

      // --- QUADRATIC EQUATIONS ---
      {
        conceptId: conceptMap['quadratic_equations']._id,
        conceptSlug: 'quadratic_equations',
        difficulty: 4,
        question: 'What are the roots of x^2 - 5x + 6 = 0?',
        options: ['x = 2 and x = 3', 'x = -2 and x = -3', 'x = 1 and x = 6', 'x = -1 and x = 6'],
        correctAnswer: 'x = 2 and x = 3',
        explanation: 'Factor the quadratic: (x - 2)(x - 3) = 0. Roots are x = 2 and x = 3.',
        hint: 'Find two numbers that multiply to 6 and add to -5.',
      },
      {
        conceptId: conceptMap['quadratic_equations']._id,
        conceptSlug: 'quadratic_equations',
        difficulty: 5,
        question: 'Find the discriminant of 2x^2 - 4x + 5 = 0 and determine the nature of its roots.',
        options: ['-24 (Two complex roots)', '56 (Two real roots)', '0 (One real root)', '-8 (Two complex roots)'],
        correctAnswer: '-24 (Two complex roots)',
        explanation: 'Discriminant Delta = b^2 - 4ac = (-4)^2 - 4(2)(5) = 16 - 40 = -24. Since Delta < 0, there are two distinct complex roots.',
        hint: 'Apply the discriminant formula: b^2 - 4ac.',
      },
    ];

    await Question.insertMany(questionData);

    console.log('✅ LearnIQ Clean Curriculum Initialized!');
    console.log('No demo mock students loaded. Live scoring active for registered users.');
    return { status: 'ready' };
  } catch (error) {
    console.error('Curriculum initialization error:', error);
    throw error;
  }
};

if (require.main === module) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}

module.exports = { seedDatabase };
