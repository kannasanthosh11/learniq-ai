const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('learniq_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async register(name, email, password, role = 'student') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  // Student Endpoints
  async getStudent(studentId) {
    const res = await fetch(`${API_BASE}/student/${studentId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch student details');
    return res.json();
  },

  async getMastery(studentId) {
    const res = await fetch(`${API_BASE}/student/${studentId}/mastery`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch mastery');
    return res.json();
  },

  async getGaps(studentId) {
    const res = await fetch(`${API_BASE}/student/${studentId}/gaps`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch knowledge gaps');
    return res.json();
  },

  async getRecommendations(studentId) {
    const res = await fetch(`${API_BASE}/student/${studentId}/recommendations`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async getGraph(studentId) {
    const res = await fetch(`${API_BASE}/student/${studentId}/graph`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch knowledge graph');
    return res.json();
  },

  async getProgress(studentId) {
    const res = await fetch(`${API_BASE}/student/${studentId}/progress`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch student progress');
    return res.json();
  },

  // Question Endpoints
  async getNextQuestion(studentId, conceptId) {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (conceptId) params.append('conceptId', conceptId);

    const res = await fetch(`${API_BASE}/questions/next?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to fetch next question');
    }
    return res.json();
  },

  async answerQuestion(questionId, studentId, selectedAnswer) {
    const res = await fetch(`${API_BASE}/questions/${questionId}/answer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ studentId, selectedAnswer }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit answer');
    }
    return res.json();
  },

  // Teacher Endpoints
  async getTeacherCohort() {
    const res = await fetch(`${API_BASE}/teacher/students`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load teacher cohort data');
    return res.json();
  },

  async getTeacherStudent(studentId) {
    const res = await fetch(`${API_BASE}/teacher/student/${studentId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load student analytics');
    return res.json();
  },

  async getConceptAnalytics() {
    const res = await fetch(`${API_BASE}/teacher/concepts`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load concept analytics');
    return res.json();
  },

  // AI Cognitive Analysis API (Gemini / OpenAI API Key Powered)
  async analyzeProfile(studentId) {
    const res = await fetch(`${API_BASE}/ai/analyze-profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ studentId }),
    });
    if (!res.ok) throw new Error('Failed to run AI profile analysis');
    return res.json();
  },

  async setApiKey(apiKey, provider = 'gemini') {
    const res = await fetch(`${API_BASE}/ai/set-key`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ apiKey, provider }),
    });
    if (!res.ok) throw new Error('Failed to configure AI API key');
    return res.json();
  },

  async getAiStatus() {
    const res = await fetch(`${API_BASE}/ai/status`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to get AI status');
    return res.json();
  },
};
