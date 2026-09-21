/**
 * Corbett & Anderson (1995) Bayesian Knowledge Tracing (BKT) Engine
 * 
 * Parameters:
 * P(L): Prior probability of mastery
 * P(T): Transition probability (learning step)
 * P(G): Probability of guessing correctly given unmastered
 * P(S): Probability of slipping (incorrect answer given mastered)
 */

class BKTEngine {
  /**
   * Updates student mastery for a concept following an answer response
   * @param {number} currentL - Current probability of mastery P(L)
   * @param {boolean} isCorrect - Whether student answer was correct
   * @param {object} params - { pT, pG, pS }
   * @returns {object} Updated probability and diagnostic calculations
   */
  static updateMastery(currentL, isCorrect, params = {}) {
    const pT = params.pTransition ?? 0.15;
    const pG = params.pGuess ?? 0.20;
    const pS = params.pSlip ?? 0.10;

    // Numerical safety clamp
    const pL = Math.max(0.01, Math.min(0.99, Number(currentL) || 0.30));

    let pL_obs;

    if (isCorrect) {
      // P(correct) = P(L)*(1-S) + (1-P(L))*G
      const pCorrect = (pL * (1 - pS)) + ((1 - pL) * pG);
      // P(L | correct) = [P(L) * (1-S)] / P(correct)
      pL_obs = pCorrect > 0 ? (pL * (1 - pS)) / pCorrect : pL;
    } else {
      // P(incorrect) = P(L)*S + (1-P(L))*(1-G)
      const pIncorrect = (pL * pS) + ((1 - pL) * (1 - pG));
      // P(L | incorrect) = [P(L) * S] / P(incorrect)
      pL_obs = pIncorrect > 0 ? (pL * pS) / pIncorrect : pL;
    }

    // Step 2: Learning Transition
    // P(L_next) = P(L_obs) + (1 - P(L_obs)) * P(T)
    const pL_next = pL_obs + ((1 - pL_obs) * pT);

    // Clamp to [0.02, 0.99]
    const finalMastery = Math.max(0.02, Math.min(0.99, pL_next));
    const delta = finalMastery - pL;

    return {
      previousMastery: Math.round(pL * 1000) / 1000,
      posteriorMastery: Math.round(pL_obs * 1000) / 1000,
      newMastery: Math.round(finalMastery * 1000) / 1000,
      delta: Math.round(delta * 1000) / 1000,
      parameters: {
        pTransition: pT,
        pGuess: pG,
        pSlip: pS,
      },
    };
  }

  /**
   * Categorizes mastery into standard states
   * @param {number} probability - 0 to 1
   * @returns {string} 'mastered' | 'learning' | 'weak' | 'not_started'
   */
  static getMasteryStatus(probability) {
    if (probability >= 0.75) return 'mastered';
    if (probability >= 0.50) return 'learning';
    if (probability >= 0.05) return 'weak';
    return 'not_started';
  }
}

module.exports = BKTEngine;
