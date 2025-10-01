from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

app = Flask(__name__)

# Load mock data
internships_df = pd.read_json('mock_internships.json')

# Prepare TF-IDF Vectorizer once at startup
vectorizer = TfidfVectorizer(stop_words='english')
internships_df['text_features'] = internships_df['skills_required'] + " " + internships_df['sector']
tfidf_matrix = vectorizer.fit_transform(internships_df['text_features'])

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    education = data.get("education", "")
    skills = data.get("skills", "")
    location = data.get("location", "")

    # 1. Prepare User Data for ML
    user_text = f"{skills} {education} {location}"
    user_vector = vectorizer.transform([user_text])

    # 2. Calculate Cosine Similarity
    cosine_sim = cosine_similarity(user_vector, tfidf_matrix).flatten()

    # 3. Hybrid Ranking Logic (Weighting)
    results_df = internships_df.copy()
    results_df['similarity'] = cosine_sim

    # Location Bonus: +0.2 if location matches exactly
    results_df['location_bonus'] = results_df.apply(
        lambda row: 0.2 if row['location'] == location else 0, axis=1
    )

    # Calculate Final Hybrid Score
    results_df['final_score'] = (results_df['similarity'] * 0.7) + (results_df['location_bonus'] * 0.3)

    # 4. Select Top 3
    top_recommendations = results_df.nlargest(3, 'final_score')

    # Format Output
    output = []
    for _, row in top_recommendations.iterrows():
        match_percent = int(row['final_score'] * 100 / (1 + 0.2 * 0.3))  # normalize

        output.append({
            "id": row['id'],
            "title": row['title'],
            "organization": row['organization'],
            "location": row['location'],
            "match_score": match_percent
        })

    return jsonify(output)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8001, debug=True)
