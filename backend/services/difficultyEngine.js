/**
 * Dynamic Difficulty Engine
 * 
 * Levels:
 * 1 = Beginner
 * 2 = Easy
 * 3 = Medium
 * 4 = Hard
 * 5 = Advanced
 */

class DifficultyEngine {
  /**
   * Calculates baseline difficulty from mastery percentage
   * @param {number} mastery - 0 to 1
   * @returns {number} difficulty level 1 to 5
   */
  static getBaseDifficulty(mastery) {
    const m = Number(mastery) || 0;
    if (m < 0.40) return 1;
    if (m < 0.55) return 2;
    if (m < 0.70) return 3;
    if (m < 0.85) return 4;
    return 5;
  }

  /**
   * Adapts next difficulty based on mastery, streak, and recent performance
   * @param {object} params
   * @param {number} params.currentMastery - current concept mastery [0, 1]
   * @param {number} params.currentDifficulty - current level [1, 5]
   * @param {number} params.consecutiveCorrect - streak of correct answers
   * @param {number} params.consecutiveIncorrect - streak of incorrect answers
   * @param {boolean} [params.lastAnswerCorrect] - whether the latest response was correct
   * @param {number} [params.prereqMastery] - optional foundational prerequisite mastery
   * @returns {object} { nextDifficulty, reason, levelName, adjusted }
   */
  static adaptDifficulty({
    currentMastery,
    currentDifficulty = 3,
    consecutiveCorrect = 0,
    consecutiveIncorrect = 0,
    lastAnswerCorrect = null,
    prereqMastery = 1.0,
  }) {
    let diff = currentDifficulty;
    let reason = 'Maintaining current difficulty level to consolidate understanding.';
    let adjusted = false;

    // Rule: Prerequisite bottleneck enforcement
    if (prereqMastery < 0.45 && diff > 2) {
      diff = 2;
      reason = 'Foundational prerequisite gap detected. Difficulty capped at Level 2 (Easy) until foundational concepts are solidified.';
      adjusted = true;
    }
    // Rule: Consecutive 3 correct -> increase difficulty by 1
    else if (consecutiveCorrect >= 3 && diff < 5) {
      diff += 1;
      reason = `Consistent mastery demonstrated (${consecutiveCorrect} correct in a row). Advancing to Level ${diff}.`;
      adjusted = true;
    }
    // Rule: Consecutive 2 incorrect -> decrease difficulty by 1
    else if (consecutiveIncorrect >= 2 && diff > 1) {
      diff -= 1;
      reason = `Multiple recent errors detected (${consecutiveIncorrect} incorrect in a row). Scaling down to Level ${diff} to reinforce foundations.`;
      adjusted = true;
    }
    // Rule: Sync with baseline if discrepancy is too wide
    else {
      const baseDiff = this.getBaseDifficulty(currentMastery);
      if (Math.abs(baseDiff - diff) >= 2) {
        diff = baseDiff > diff ? diff + 1 : diff - 1;
        reason = `Aligning difficulty to student mastery state (${Math.round(currentMastery * 100)}%).`;
        adjusted = true;
      }
    }

    // Safety clamp 1 to 5
    diff = Math.max(1, Math.min(5, diff));

    const levelNames = {
      1: 'Beginner',
      2: 'Easy',
      3: 'Medium',
      4: 'Hard',
      5: 'Advanced',
    };

    return {
      currentDifficulty,
      nextDifficulty: diff,
      levelName: levelNames[diff],
      reason,
      adjusted,
    };
  }

  static getLevelName(level) {
    const names = { 1: 'Beginner', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Advanced' };
    return names[level] || 'Medium';
  }
}

module.exports = DifficultyEngine;
