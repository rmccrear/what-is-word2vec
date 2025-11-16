# Word2Vec Similarity Search Web App

A React web application that finds the 10 most similar words using word2vec cosine similarity. All calculations are done client-side using a local JSON file - no backend server needed!

## Setup

1. Install Node dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will run on http://localhost:5173 (or another port if 5173 is taken)

## Usage

1. Enter a word in the search input
2. Click "Search" to find the 10 most similar words
3. Results are displayed in a table with similarity scores

## Features

- Controlled form input for word search
- Client-side cosine similarity calculations
- Displays top 10 most similar words from 1000-word database
- Styled with Sakura CSS for a clean, minimal look
- Error handling for invalid words
- No backend server required - everything runs in the browser

## Data

The app uses `src/word_vectors.json` which contains 1000 words and their 25-dimensional vectors from the GloVe Twitter model. The JSON file is imported directly into the React app.

## Converting CSV to JSON

If you need to regenerate the JSON file from the CSV:
```bash
cd ..
source venv/bin/activate
python -c "import pandas as pd; import json; df = pd.read_csv('top_1000_words_vectors.csv'); data = {'words': df['word'].tolist(), 'vectors': df.iloc[:, 1:].values.tolist()}; json.dump(data, open('web-app/src/word_vectors.json', 'w'), indent=2)"
```
