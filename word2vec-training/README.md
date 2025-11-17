# Word2Vec Training

This directory contains scripts for training a custom Word2Vec model from scratch.

## Overview

The training script (`train_word2vec.py`) downloads the text8 corpus and trains a Word2Vec model with the following parameters:

- **vector_size**: 50 (50-dimensional word vectors)
- **window**: 5 (context window of 5 words on each side)
- **min_count**: 30 (ignore words appearing fewer than 30 times)
- **workers**: 4 (use 4 CPU threads for training)
- **max_final_vocab**: 5000 (cap vocabulary at ~5000 words)

## Prerequisites

Make sure you have the required dependencies installed. The parent directory's `requirements.txt` includes `gensim`, which is needed for training.

If you need to install dependencies:

```bash
cd ..
pip install -r requirements.txt
```

## Usage

1. **Navigate to the training directory:**
   ```bash
   cd word2vec-training
   ```

2. **Run the training script:**
   ```bash
   python train_word2vec.py
   ```

The script will:
- Download the text8 corpus (if not already cached)
- Prepare the corpus into sentences
- Train the Word2Vec model
- Save the model as `word2vec_model.model`
- Test the model with a sample word

## Output

After training completes, you'll have:
- `word2vec_model.model` - The trained Word2Vec model file

## Loading the Trained Model

To use the trained model in other scripts:

```python
from gensim.models import Word2Vec

# Load the model
model = Word2Vec.load("word2vec_model.model")

# Get word vector
vector = model.wv['word']

# Find similar words
similar = model.wv.most_similar('word', topn=10)
```

## Notes

- Training may take several minutes depending on your hardware
- The text8 corpus is approximately 100MB and will be cached after first download
- The vocabulary size will be limited by `min_count=30` and the corpus size


