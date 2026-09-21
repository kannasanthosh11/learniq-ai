const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');
const { seedDatabase } = require('./seed/seed');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const questionRoutes = require('./routes/questionRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const conceptRoutes = require('./routes/conceptRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'LearnIQ',
    track: 'TENSORA 2026 — EDU-01',
    timestamp: new Date().toISOString(),
  });
});

// Seed endpoint for judges / quick reset
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ message: 'Database successfully re-seeded with demo benchmark states!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to re-seed', error: err.message });
  }
});

const aiRoutes = require('./routes/aiRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/concepts', conceptRoutes);
app.use('/api/ai', aiRoutes);

// Static frontend serving for production / unified hosting
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  console.log(`📦 Serving static frontend distribution from ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Auto-seed if running fresh
    const Concept = require('./models/Concept');
    const conceptCount = await Concept.countDocuments();
    if (conceptCount === 0) {
      console.log('Database empty! Triggering automatic initial seed...');
      await seedDatabase();
      console.log('Automatic seed complete.');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 LearnIQ Backend Engine running on http://localhost:${PORT}`);
      console.log(`📊 AI Engines: BKT Engine, Knowledge Graph, Gap Detector, Difficulty Engine ACTIVE`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
