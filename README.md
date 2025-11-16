# Word2Vec Similarity Search - Educational Project

An interactive web application that demonstrates **Word2Vec** and **cosine similarity** calculations. This project is designed for educational purposes to help students and developers understand how word embeddings work and how similarity is calculated between vectors.

## 🎓 Educational Goals

This project teaches:

1. **Word Embeddings**: How words are represented as vectors in high-dimensional space
2. **Cosine Similarity**: The mathematical formula for measuring similarity between vectors
3. **Vector Mathematics**: Dot products, vector magnitudes, and normalization
4. **React Development**: Modern React patterns including custom hooks, component composition, and testing
5. **Client-Side Computation**: Performing complex calculations entirely in the browser

## 📚 Key Concepts Demonstrated

### Word2Vec
- Words are represented as 25-dimensional vectors
- Similar words have similar vector representations
- The GloVe (Global Vectors) model learns these representations from text data

### Cosine Similarity
The similarity between two word vectors is calculated as:

```
cosine_similarity = (A · B) / (||A|| × ||B||)
```

Where:
- **A · B** = Dot product (sum of element-wise multiplication)
- **||A||** = Magnitude of vector A (Euclidean length)
- **||B||** = Magnitude of vector B

### Interactive Learning
- **Hover tooltips** show vector values and calculation steps
- **Click on results** to see detailed dot product calculations
- **Visual charts** display similarity scores
- **Step-by-step formulas** explain each calculation

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python 3** (for data processing scripts, optional)

### Quick Start

1. **Navigate to the web app:**
   ```bash
   cd web-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be available at `http://localhost:5173`
   - Enter a word to see similar words and their similarity scores

## 📖 How to Use This for Learning

### For Students

1. **Start with the About section** - Read the explanation of Word2Vec and cosine similarity
2. **Search for a word** - Try words like "king", "queen", "happy", "sad"
3. **Explore the results** - Notice which words are most similar and why
4. **Click on a result** - See the detailed calculation of how similarity is computed
5. **Hover over values** - View the actual vector components and intermediate calculations

### For Educators

- **Demonstrate vector similarity** - Show how mathematical concepts apply to real-world NLP
- **Explain the calculations** - Use the interactive tooltips to walk through formulas
- **Compare words** - Show how semantic relationships are captured in vector space
- **Code walkthrough** - Review the implementation to understand React patterns and algorithms

## 🔬 What You'll Learn

### Mathematics
- Vector operations (dot product, magnitude)
- Cosine similarity formula
- Normalization techniques
- Sorting and ranking algorithms

### Programming
- **React Hooks**: Custom hooks (`useWordSearch`) for state management
- **Component Architecture**: Separation of concerns, reusable components
- **Testing**: React Testing Library, Vitest, test-driven development
- **Performance**: Debouncing, client-side calculations, efficient rendering

### Machine Learning Concepts
- Word embeddings
- Vector similarity
- Semantic relationships
- Model limitations and biases

## 📁 Project Structure

```
├── web-app/              # React web application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions (cosine similarity, etc.)
│   │   └── word_vectors.json  # Word embedding data
│   └── package.json
├── word_vec_to_csv.py    # Python script for data processing
├── top_1000_words_vectors.csv  # Source data
└── requirements.txt      # Python dependencies
```

## 🧪 Running Tests

To see how the code is tested:

```bash
cd web-app
npm test
```

Tests cover:
- Utility functions (cosine similarity, word utilities)
- React components (tooltips, tables, etc.)
- Custom hooks (word search logic)

## 📊 Data Source

This project uses word embeddings from the **GloVe Twitter 25-dimensional model**:
- **Source**: [jkrukowski/glove-twitter-25](https://huggingface.co/jkrukowski/glove-twitter-25) on Hugging Face
- **Vocabulary**: 1,000 most common words
- **Dimensions**: 25-dimensional vectors
- **Training Data**: Twitter text corpus

## 🎯 Learning Exercises

Try these exercises to deepen your understanding:

1. **Compare similar words**: Search for "happy" and "sad" - notice their similarity scores
2. **Explore relationships**: Try "king" and "queen" - see how they relate semantically
3. **Check calculations**: Click on a result to verify the dot product calculation
4. **Modify the code**: Change the number of results returned (currently 10)
5. **Add features**: Implement filtering or sorting by similarity threshold

## 📝 Additional Resources

- **Formulas**: See `COSINE_SIMILARITY_FORMULAS.md` for detailed mathematical explanations
- **Excel Formulas**: See `EXCEL_FORMULA_EXPLANATION.md` for spreadsheet implementations
- **Web App README**: See `web-app/README.md` for technical setup details

## ⚠️ Important Notes

- This is an **educational project** - see `ACKNOWLEDGMENT.md` for details
- The model may contain biases from training data
- Limited to 1,000 words - not all words are available
- Calculations are done client-side for learning purposes

## 🤖 AI Assistance

This project was developed with the assistance of **Composer** (a language model trained by Cursor), an AI coding assistant. AI was used for code generation, refactoring, testing, documentation, and code review. See `ACKNOWLEDGMENT.md` for more details.

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork and experiment
- Add more educational features
- Improve documentation
- Share with students and educators

---

**Happy Learning!** 🎓 Explore, experiment, and understand how word embeddings work!

