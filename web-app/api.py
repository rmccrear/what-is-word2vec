from flask import Flask, request, jsonify
from flask_cors import CORS
import gensim.downloader as api
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the word2vec model (load once at startup)
print("Loading word2vec model...")
model = api.load("glove-twitter-25")
print(f"Model loaded! Vocabulary size: {len(model.key_to_index)}")

def cosine_similarity(vec1, vec2):
    """Calculate cosine similarity between two vectors."""
    dot_product = np.dot(vec1, vec2)
    magnitude1 = np.linalg.norm(vec1)
    magnitude2 = np.linalg.norm(vec2)
    if magnitude1 == 0 or magnitude2 == 0:
        return 0
    return dot_product / (magnitude1 * magnitude2)

@app.route('/api/search', methods=['POST'])
def search_similar_words():
    """Find the top 10 most similar words to the input word."""
    data = request.json
    word = data.get('word', '').lower().strip()
    
    if not word:
        return jsonify({'error': 'Word is required'}), 400
    
    if word not in model.key_to_index:
        return jsonify({'error': f'Word "{word}" not found in vocabulary'}), 404
    
    # Get the input word's vector
    input_vector = model[word]
    
    # Calculate similarity with all words
    similarities = []
    for vocab_word in model.key_to_index.keys():
        if vocab_word != word:  # Exclude the input word itself
            vocab_vector = model[vocab_word]
            similarity = cosine_similarity(input_vector, vocab_vector)
            similarities.append({
                'word': vocab_word,
                'similarity': float(similarity)
            })
    
    # Sort by similarity (descending) and get top 10
    similarities.sort(key=lambda x: x['similarity'], reverse=True)
    top_10 = similarities[:10]
    
    return jsonify({
        'input_word': word,
        'results': top_10
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'vocabulary_size': len(model.key_to_index)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)

