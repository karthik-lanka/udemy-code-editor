const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const path = require('path');
const fetch = require('node-fetch');

// Load environment variables from api.env
dotenv.config({ path: path.resolve(__dirname, 'api.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI only if API key is available
let openai;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Serve static files from root directory

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to LearnX Backend API' });
});

// Course routes
app.get('/api/courses', (req, res) => {
    res.json({
        courses: [
            {
                id: 1,
                title: 'Introduction to Python',
                description: 'Learn Python programming from scratch',
                duration: '8 hours',
                level: 'Beginner'
            },
            {
                id: 2,
                title: 'Advanced JavaScript',
                description: 'Master modern JavaScript concepts',
                duration: '10 hours',
                level: 'Intermediate'
            }
        ]
    });
});

// AI Code Review endpoint
app.post('/api/review', async (req, res) => {
    try {
        const { code, language } = req.body;
        if (!code || !language) {
            return res.status(400).json({ error: 'Code and language are required' });
        }

        const HF_API_URL = "https://api-inference.huggingface.co/models/bigcode/starcoder"; // Example model
        const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: code })
        });

        const data = await response.json();
        // The output format depends on the model. Adjust as needed.
        res.json({ review: data[0]?.generated_text || JSON.stringify(data) });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error processing code review', details: error.message });
    }
});

// Code execution endpoint
app.post('/api/run', async (req, res) => {
    try {
        const { code, language } = req.body;
        
        // For now, we'll return a placeholder response
        // In a real implementation, you would execute the code in a sandbox
        res.json({
            output: "Code execution is not implemented yet. This is a placeholder response."
        });
    } catch (error) {
        res.status(500).json({ error: 'Error executing code' });
    }
});

// Code verification endpoint
app.post('/api/verify', async (req, res) => {
    try {
        const { code, language, testCases } = req.body;
        
        if (!testCases || testCases.length === 0) {
            return res.json({
                message: "No test cases available for this lesson."
            });
        }

        // For now, we'll return a placeholder response
        // In a real implementation, you would verify the code against test cases
        const results = testCases.map(testCase => {
            return {
                input: testCase.input,
                expected: testCase.expected,
                status: "pending",
                message: "Code verification is not implemented yet. This is a placeholder response."
            };
        });

        res.json({
            message: "Code verification results:",
            results: results
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error verifying code' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 