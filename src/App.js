import React, { useState } from 'react';
import axios from 'axios';

// Component for a single recommendation card
const RecommendationCard = ({ recommendation }) => {
    return (
        <div style={{ padding: '15px', margin: '10px 0', border: `2px solid ${recommendation.match_score > 80 ? 'green' : 'orange'}`, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#0056b3' }}>{recommendation.title}</h3>
            <p><strong>{recommendation.organization}</strong> - {recommendation.location}</p>
            <p style={{ fontWeight: 'bold' }}>Match Score: <span style={{ color: 'red' }}>{recommendation.match_score}%</span></p>
            <button style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Apply Now (अभी आवेदन करें)
            </button>
        </div>
    );
};

// Main widget component
const RecommendationWidget = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('EN'); // EN or HI
    
    // --- State for the Simple User Input (Task A) ---
    const [userSkills, setUserSkills] = useState('Hindi');
    const [userLocation, setUserLocation] = useState('Madhya Pradesh');
    const [userEducation, setUserEducation] = useState('High School');

    const toggleLanguage = () => {
        setLanguage(language === 'EN' ? 'HI' : 'EN');
    };

    const fetchRecommendations = async () => {
        setLoading(true);
        setError('');
        
        // Prepare data for the Express API
        const userProfile = {
            education: userEducation,
            skills: userSkills,
            location: userLocation,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/recommendations', userProfile);
            setRecommendations(response.data);
        } catch (err) {
            setError(language === 'EN' ? 'Could not fetch recommendations.' : 'सिफारिशें प्राप्त नहीं हो सकीं।');
            setRecommendations([]);
        } finally {
            setLoading(false);
        }
    };

    const strings = {
        title: language === 'EN' ? "Personalized Internship Recommendations" : "व्यक्तिगत इंटर्नशिप सिफ़ारिशें",
        button: language === 'EN' ? "Get Recommendations" : "सिफारिशें प्राप्त करें",
        loading: language === 'EN' ? "Generating personalized matches..." : "व्यक्तिगत मैच उत्पन्न हो रहे हैं...",
        inputLabel: language === 'EN' ? "Your Core Skills:" : "आपके मुख्य कौशल:",
        locationLabel: language === 'EN' ? "Preferred Location:" : "पसंदीदा स्थान:",
    };

    return (
        <div style={{ border: '2px dashed #007bff', padding: '20px', margin: '20px', maxWidth: '400px', backgroundColor: '#e6f0ff' }}>
            <h2 style={{ color: '#0056b3' }}>{strings.title}</h2>
            
            <button onClick={toggleLanguage} style={{ float: 'right', padding: '5px 10px' }}>
                {language === 'EN' ? 'HI' : 'EN'}
            </button>

            {/* --- SIMPLE INPUT FORM (Task A) --- */}
            <div style={{ margin: '10px 0' }}>
                <p>{strings.inputLabel}</p>
                <input 
                    type="text" 
                    value={userSkills} 
                    onChange={(e) => setUserSkills(e.target.value)} 
                    placeholder="e.g. Tally, Hindi"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                 <p>{strings.locationLabel}</p>
                 {/* SIMPLE ICON SELECTION - REPLACE WITH REAL ICONS/DROPDOWN */}
                 <button onClick={() => setUserLocation('Madhya Pradesh')} style={{ margin: '5px', padding: '8px', border: userLocation === 'Madhya Pradesh' ? '2px solid red' : '1px solid gray' }}>
                    Agri (MP)
                </button>
                <button onClick={() => setUserLocation('Bangalore')} style={{ margin: '5px', padding: '8px', border: userLocation === 'Bangalore' ? '2px solid red' : '1px solid gray' }}>
                    IT (BLR)
                </button>
            </div>
            {/* ------------------------------------- */}
            
            <button 
                onClick={fetchRecommendations} 
                disabled={loading}
                style={{ width: '100%', padding: '10px', backgroundColor: loading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1em' }}
            >
                {loading ? strings.loading : strings.button}
            </button>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            <div style={{ marginTop: '20px' }}>
                {recommendations.map(rec => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
            </div>
        </div>
    );
};

export default RecommendationWidget;

// To run this service: Integrate this component into your main React App.`