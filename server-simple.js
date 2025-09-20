import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Simple logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Read the jobs data
let jobsData;
try {
    const data = readFileSync(join(__dirname, 'db.json'), 'utf8');
    jobsData = JSON.parse(data);
} catch (error) {
    console.error('Error reading db.json:', error);
    jobsData = { jobs: [] };
}

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Vue Jobs API - Simple Server',
        endpoints: ['/jobs', '/jobs/:id', '/health']
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', jobs: jobsData.jobs.length });
});

app.get('/jobs', (req, res) => {
    res.json(jobsData.jobs);
});

app.get('/jobs/:id', (req, res) => {
    const job = jobsData.jobs.find(j => j.id === req.params.id);
    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ error: 'Job not found' });
    }
});

// For deployment, we'll keep it read-only to avoid file system issues
app.post('/jobs', (req, res) => {
    res.status(501).json({ error: 'POST operations not supported in deployment mode' });
});

app.put('/jobs/:id', (req, res) => {
    res.status(501).json({ error: 'PUT operations not supported in deployment mode' });
});

app.delete('/jobs/:id', (req, res) => {
    res.status(501).json({ error: 'DELETE operations not supported in deployment mode' });
});

app.listen(PORT, () => {
    console.log(`Simple server running on port ${PORT}`);
});