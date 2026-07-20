const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const scoreFile = path.join(__dirname, 'scores.json');

// Initialize score file
if (!fs.existsSync(scoreFile)) {
    fs.writeFileSync(scoreFile, JSON.stringify([]));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Get scores
app.get('/scores', (req, res) => {
    try {
        const scores = JSON.parse(fs.readFileSync(scoreFile, 'utf8'));
        const bestMap = {};
        for (const s of scores) {
            if (!bestMap[s.name] || s.score > bestMap[s.name].score) {
                bestMap[s.name] = s;
            }
        }
        const deduped = Object.values(bestMap);
        deduped.sort((a, b) => b.score - a.score);
        res.json(deduped.slice(0, 10)); // Top 10
    } catch (e) {
        res.json([]);
    }
});

// Post score
app.post('/score', (req, res) => {
    const { name, score } = req.body;
    if (!name || typeof score !== 'number') return res.status(400).json({ error: 'Invalid data' });

    try {
        const scores = JSON.parse(fs.readFileSync(scoreFile, 'utf8'));
        scores.push({ name, score, date: new Date().toISOString() });
        
        const bestMap = {};
        for (const s of scores) {
            if (!bestMap[s.name] || s.score > bestMap[s.name].score) {
                bestMap[s.name] = s;
            }
        }
        const deduped = Object.values(bestMap);
        deduped.sort((a, b) => b.score - a.score);
        
        // Keep only top 100 on disk to save space
        const topScores = deduped.slice(0, 100);
        fs.writeFileSync(scoreFile, JSON.stringify(topScores));
        res.json({ success: true, topScores: topScores.slice(0,10) });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
