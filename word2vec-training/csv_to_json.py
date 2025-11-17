"""
Convert Word2Vec CSV to JSON format for web app.

Converts CSV file with format:
  word,dim_0,dim_1,...,dim_N

To JSON format:
  {
    "words": ["word1", "word2", ...],
    "vectors": [[dim0, dim1, ...], [dim0, dim1, ...], ...]
  }
"""

import pandas as pd
import json
import sys
import os

def csv_to_json(csv_path="word_vectors_trained.csv", json_path=None):
    """
    Convert CSV to JSON format.
    
    Args:
        csv_path: Path to input CSV file
        json_path: Path to output JSON file (default: same name as CSV with .json extension)
    """
    if json_path is None:
        json_path = csv_path.replace(".csv", ".json")
    
    print("=" * 60)
    print("CSV to JSON Converter")
    print("=" * 60)
    
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found: {csv_path}")
        return
    
    print(f"\n1. Reading CSV: {csv_path}")
    df = pd.read_csv(csv_path)
    
    print(f"   Found {len(df)} words")
    print(f"   Vector dimensions: {len(df.columns) - 1}")
    
    # Extract words and vectors
    print("2. Extracting words and vectors...")
    words = df['word'].tolist()
    
    # Get all dimension columns
    dim_columns = [col for col in df.columns if col.startswith('dim_')]
    # Sort by dimension number to ensure correct order
    dim_columns.sort(key=lambda x: int(x.split('_')[1]))
    
    # Convert vectors to list of lists
    vectors = df[dim_columns].values.tolist()
    
    # Convert numpy float types to Python floats for JSON serialization
    # Round to 6 decimal places to reduce file size while maintaining precision
    print("3. Converting and optimizing vectors...")
    vectors = [[round(float(val), 6) for val in vec] for vec in vectors]
    
    # Create JSON structure
    print("4. Creating JSON structure...")
    json_data = {
        "words": words,
        "vectors": vectors
    }
    
    # Save to JSON (compact format, no indentation to reduce file size)
    print(f"5. Saving JSON (compact format): {json_path}")
    with open(json_path, 'w') as f:
        json.dump(json_data, f, separators=(',', ':'))  # Compact: no spaces
    
    print(f"\n✅ Successfully converted {len(words)} words to {json_path}")
    print(f"   File size: {os.path.getsize(json_path) / (1024*1024):.2f} MB")
    
    # Show sample
    print(f"\nSample data:")
    print(f"   First word: {words[0]}")
    print(f"   First vector (first 5 dims): {vectors[0][:5]}")

if __name__ == "__main__":
    csv_path = "word_vectors_trained.csv"
    json_path = None
    
    if len(sys.argv) > 1:
        csv_path = sys.argv[1]
    
    if len(sys.argv) > 2:
        json_path = sys.argv[2]
    
    csv_to_json(csv_path, json_path)

