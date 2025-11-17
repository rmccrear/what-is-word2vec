"""
Extract words and vectors from a trained Word2Vec model and save to CSV.

This script loads a trained Word2Vec model and exports all words and their
vectors to a CSV file format compatible with the web app and Excel sheets.
"""

from gensim.models import Word2Vec
import pandas as pd
import numpy as np
import sys
import os

def model_to_csv(model_path="word2vec_model.model", output_file="word_vectors_trained.csv"):
    """
    Load a trained Word2Vec model and export words/vectors to CSV.
    
    Args:
        model_path: Path to the trained Word2Vec model file
        output_file: Output CSV file path
    """
    print("=" * 60)
    print("Word2Vec Model to CSV Export")
    print("=" * 60)
    
    # Check if model file exists
    if not os.path.exists(model_path):
        print(f"Error: Model file not found: {model_path}")
        print("Please train a model first using train_word2vec.py")
        return
    
    # Load the trained model
    print(f"\n1. Loading model from: {model_path}")
    model = Word2Vec.load(model_path)
    print(f"   Model loaded successfully!")
    
    # Get word vectors
    wv = model.wv
    vocabulary_size = len(wv.key_to_index)
    vector_size = wv.vector_size
    
    print(f"   Vocabulary size: {vocabulary_size}")
    print(f"   Vector dimensions: {vector_size}")
    
    # Extract all words (already filtered during training)
    print(f"\n2. Extracting {vocabulary_size} words and vectors...")
    words = list(wv.key_to_index.keys())
    
    # Prepare data rows
    print("3. Formatting data for CSV...")
    data_rows = []
    
    for word in words:
        # Get the vector (numpy array)
        vector = wv[word]
        
        # Create the row: [word, vector[0], vector[1], ..., vector[D-1]]
        # Convert vector to string array and prepend the word
        row = np.insert(vector.astype(str), 0, word)
        data_rows.append(row)
    
    # Create DataFrame
    print("4. Creating DataFrame...")
    column_names = ['word'] + [f'dim_{i}' for i in range(vector_size)]
    df = pd.DataFrame(data_rows, columns=column_names)
    
    # Save to CSV
    print(f"5. Saving to CSV: {output_file}")
    df.to_csv(output_file, index=False, header=True)
    
    print(f"\n✅ Successfully saved {len(df)} words to {output_file}")
    print(f"   Dimensions: {vector_size}")
    print(f"\nFile Structure (first 5 rows):")
    print(df.head())
    print(f"\nFile Structure (last 5 rows):")
    print(df.tail())
    
    return df

if __name__ == "__main__":
    # Allow command line arguments: python model_to_csv.py <model_path> <output_file>
    model_path = "word2vec_model.model"
    output_file = "word_vectors_trained.csv"
    
    if len(sys.argv) > 1:
        model_path = sys.argv[1]
    
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    model_to_csv(model_path, output_file)

