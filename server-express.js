import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// CORS middleware - simplified and more robust
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://*.netlify.app', 'https://*.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files
app.use(express.static(join(__dirname, 'public')));

// Helper function to read/write DB
function readDB() {
    try {
        const data = readFileSync(join(__dirname, 'db.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading db.json:', error);
        return { jobs: [] };
    }
}

function writeDB(data) {
    try {
        writeFileSync(join(__dirname, 'db.json'), JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing db.json:', error);
    }
}

// Routes
// GET /jobs
app.get('/jobs', (req, res) => {
    const db = readDB();
    res.json(db.jobs);
});

// GET /jobs/:id
app.get('/jobs/:id', (req, res) => {
    const db = readDB();
    const job = db.jobs.find(j => j.id === req.params.id);
    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

// POST /jobs
app.post('/jobs', (req, res) => {
    const db = readDB();
    const newJob = {
        ...req.body,
        id: String(Date.now()) // Simple ID generation
    };
    db.jobs.push(newJob);
    writeDB(db);
    res.status(201).json(newJob);
});

// PUT /jobs/:id
app.put('/jobs/:id', (req, res) => {
    const db = readDB();
    const jobIndex = db.jobs.findIndex(j => j.id === req.params.id);
    if (jobIndex !== -1) {
        db.jobs[jobIndex] = { ...req.body, id: req.params.id };
        writeDB(db);
        res.json(db.jobs[jobIndex]);
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

// DELETE /jobs/:id
app.delete('/jobs/:id', (req, res) => {
    const db = readDB();
    const jobIndex = db.jobs.findIndex(j => j.id === req.params.id);
    if (jobIndex !== -1) {
        db.jobs.splice(jobIndex, 1);
        writeDB(db);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Vue Jobs API Server',
        version: '1.0.0',
        endpoints: {
            jobs: '/jobs',
            job: '/jobs/:id',
            health: '/health'
        }
    });
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check available at: /health`);
});