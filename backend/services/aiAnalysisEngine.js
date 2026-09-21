/**
 * AI Cognitive Analysis Engine
 * Uses real LLM APIs (Google Gemini or OpenAI) to perform deep pedagogical
 * diagnostic analysis on a student's genuine test scores, response patterns, and misconception roots.
 */

class AIAnalysisEngine {
  /**
   * Evaluates student's genuine response & mastery score using an AI API key
   * @param {object} params
   * @param {string} params.studentName
   * @param {string} params.conceptName
   * @param {number} params.currentMastery - current 0-1 mastery
   * @param {number} params.newMastery - updated BKT mastery
   * @param {string} params.questionText
   * @param {string} params.selectedAnswer
   * @param {string} params.correctAnswer
   * @param {boolean} params.isCorrect
   * @param {Array} params.prerequisites
   * @returns {Promise<object>} AI-generated cognitive feedback and gap diagnosis
   */
  static async analyzeScoreResponse({
    studentName = 'Student',
    conceptName,
    currentMastery,
    newMastery,
    questionText,
    selectedAnswer,
    correctAnswer,
    isCorrect,
    prerequisites = [],
  }) {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const currentPct = Math.round(currentMastery * 100);
    const newPct = Math.round(newMastery * 100);
    const prereqList = prerequisites.map(p => p.name || p).join(', ') || 'Foundational arithmetic';

    // If no AI key configured, return real pedagogical algorithmic analysis
    if (!geminiKey && !openaiKey) {
      return {
        source: 'Algorithmic BKT Evaluator (Add GEMINI_API_KEY in .env for Live LLM Analysis)',
        aiPowered: false,
        summary: isCorrect
          ? `Correct answer confirmed for ${conceptName}. Mastery increased from ${currentPct}% to ${newPct}%.`
          : `Misconception detected in ${conceptName}. Selected "${selectedAnswer}" instead of "${correctAnswer}".`,
        cognitiveDiagnosis: isCorrect
          ? `Demonstrated solid application of ${conceptName} principles. Ready for progressive difficulty.`
          : `Error suggests confusion in underlying prerequisite operations (${prereqList}).`,
        recommendedNextStep: isCorrect
          ? `Continue advancing towards mastery threshold (75%).`
          : `Review foundational prerequisite problems before attempting higher difficulty equations.`,
      };
    }

    const prompt = `You are an expert AI cognitive tutor evaluating a student's genuine learning progress.
Student: ${studentName}
Concept: ${conceptName}
Prerequisites: ${prereqList}
Prior Mastery Score: ${currentPct}%
Updated BKT Mastery Score: ${newPct}%
Question: "${questionText}"
Student Selected: "${selectedAnswer}"
Correct Answer: "${correctAnswer}"
Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'}

Analyze the student's genuine score and response. Return a JSON object with:
{
  "summary": "1-sentence executive summary of student performance",
  "cognitiveDiagnosis": "2-3 sentences explaining the exact cognitive reasoning or misconception behind their answer and how it affects prerequisite readiness",
  "gapIdentified": "${isCorrect ? 'None' : 'Name of specific prerequisite weakness if any'}",
  "recommendedNextStep": "Specific actionable recommendation for the student"
}`;

    // 1. Try Google Gemini API if key is present
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              source: 'Google Gemini AI Live Cognitive Analysis',
              aiPowered: true,
              ...parsed,
            };
          }
        } else {
          console.warn('Gemini API call returned non-200 status:', response.status);
        }
      } catch (err) {
        console.error('Error calling Gemini API:', err.message);
      }
    }

    // 2. Try OpenAI API if OpenAI key is present
    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an educational AI tutor. Output JSON only.' },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return {
            source: 'OpenAI GPT Cognitive Analysis',
            aiPowered: true,
            ...parsed,
          };
        }
      } catch (err) {
        console.error('Error calling OpenAI API:', err.message);
      }
    }

    // Fallback if network issue with AI key
    return {
      source: 'Algorithmic BKT Fallback',
      aiPowered: false,
      summary: isCorrect ? 'Mastery updated successfully.' : 'Answer evaluated.',
      cognitiveDiagnosis: `Evaluated score shift: ${currentPct}% → ${newPct}%.`,
      recommendedNextStep: 'Proceed to next practice question.',
    };
  }

  /**
   * Generates comprehensive AI analysis of a student's full score profile
   */
  static async analyzeOverallStudentProfile(student, masteries, recentResponses) {
    const geminiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const masterySummary = masteries.map(m => `${m.conceptId?.name || 'Concept'}: ${Math.round(m.probability * 100)}%`).join(', ');
    const totalAttempts = recentResponses.length;
    const correctCount = recentResponses.filter(r => r.correct).length;
    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

    if (!geminiKey && !openaiKey) {
      return {
        aiPowered: false,
        source: 'Heuristic BKT Aggregator',
        overallAssessment: `Profile tracking ${masteries.length} concepts with ${accuracy}% overall accuracy over ${totalAttempts} responses.`,
        keyStrength: masteries.find(m => m.probability >= 0.75)?.conceptId?.name || 'In progress',
        primaryIntervention: masteries.find(m => m.probability < 0.50)?.conceptId?.name || 'None',
        studyPlan: 'Complete adaptive practice across concepts below 75% mastery threshold.',
      };
    }

    const prompt = `You are an AI Educational Strategist analyzing a student's real mastery scores across a math curriculum.
Student Name: ${student.name}
Total Responses Logged: ${totalAttempts}
Overall Accuracy: ${accuracy}%
Concept Mastery Scores: ${masterySummary}

Analyze this genuine score distribution. Return JSON:
{
  "overallAssessment": "2 sentences evaluating the student's mastery trajectory",
  "keyStrength": "The strongest demonstrated concept and why",
  "primaryIntervention": "The concept that requires most urgent prerequisite attention",
  "studyPlan": "Actionable 3-step recommendation for the student"
}`;

    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
          return { aiPowered: true, source: 'Google Gemini AI', ...parsed };
        }
      } catch (e) {
        console.error('Gemini profile analysis error:', e.message);
      }
    }

    return {
      aiPowered: false,
      source: 'Algorithmic Evaluator',
      overallAssessment: `Current accuracy is ${accuracy}% across ${totalAttempts} attempts.`,
      keyStrength: 'Foundational concepts',
      primaryIntervention: 'Needs practice',
      studyPlan: 'Target lowest mastery concepts first.',
    };
  }
}

module.exports = AIAnalysisEngine;
