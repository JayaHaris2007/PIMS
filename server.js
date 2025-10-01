const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Essential for hackathon local testing
const app = express();
const PORT = 8000;
const ML_SERVICE_URL = 'http://localhost:8001/recommend'; // FastAPI/Python

// Middleware
app.use(cors());
app.use(express.json());

// Main Recommendation Endpoint
app.post('/api/recommendations', async (req, res) => {
    const userProfile = req.body;
    
    console.log('Received request for user profile:', userProfile);

    try {
        // 1. Call Python ML Service
        const mlResponse = await axios.post(ML_SERVICE_URL, userProfile);
        
        // 2. Return the ranked list from the ML service
        console.log('ML Service returned:', mlResponse.data);
        
        // Optional: Implement Caching here (Task 4.1)
        
        return res.status(200).json(mlResponse.data);

    } catch (error) {
        console.error('Error calling ML service:', error.message);
        // Handle failure gracefully (Task 4.2)
        return res.status(500).json({ 
            error: "Recommendation service is currently unavailable. Please try again later.",
            fallback: [
                {id: "FALLBACK1", title: "General Internship Listing A", organization: "Default", location: "Anywhere", match_score: 50}
            ]
        });
    }
});

app.listen(PORT, () => {
    console.log(`Express API Gateway running on http://localhost:${PORT}`);
});

// To run this service: node server.js