import gensim.downloader as api
import pandas as pd
import numpy as np
import nltk
from nltk.corpus import stopwords
import string
from langdetect import detect, LangDetectException
from better_profanity import profanity
import sys

# --- Configuration ---
NUM_WORDS = 1000
# Default model, can be overridden via command line
DEFAULT_MODEL = "glove-twitter-25"
DEFAULT_OUTPUT = "top_1000_words_vectors.csv"

def is_ascii_only(word):
    """Check if word contains only ASCII characters."""
    return all(ord(char) < 128 for char in word)

def is_english(word):
    """Check if word is English using language detection."""
    # Skip very short words or single characters as langdetect may not work well
    if len(word) < 2:
        return False
    # Skip if it's just punctuation or numbers
    if word.strip(string.ascii_letters) == word:
        return False
    try:
        return detect(word) == 'en'
    except (LangDetectException, ValueError):
        # If detection fails, assume it's not English to be safe
        return False

def is_nsfw(word):
    """Check if word contains NSFW/profane content."""
    return profanity.contains_profanity(word)

def word_vec_to_csv(model_name=None, output_file=None, num_words=None):
    """Loads a Word2Vec model, extracts the top N words/vectors (excluding stop words), and saves to CSV."""
    
    if model_name is None:
        model_name = DEFAULT_MODEL
    if output_file is None:
        output_file = DEFAULT_OUTPUT
    if num_words is None:
        num_words = NUM_WORDS
    
    print(f"1. Downloading and loading model: {model_name}...")
    try:
        # Load the KeyedVectors object (the word-to-vector mapping)
        wv = api.load(model_name)
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Please ensure you have an active internet connection.")
        return

    # Get the vocabulary keys. Gensim stores them in order of frequency.
    print(f"Model loaded with a vocabulary size of {len(wv.key_to_index)}.")
    
    # Download stop words if not already downloaded
    print("2. Loading stop words database...")
    nltk.download('stopwords', quiet=True)
    stop_words = set(stopwords.words('english'))
    print(f"   Loaded {len(stop_words)} stop words.")
    
    # Initialize profanity filter
    print("3. Initializing NSFW filter...")
    profanity.load_censor_words()
    
    # --- Data Extraction ---
    # Filter out stop words, non-ASCII, non-English, and NSFW words
    # We need to iterate through more words to get num_words filtered words
    print(f"4. Extracting top {num_words} words (filtering stop words, non-ASCII, non-English, and NSFW words)...")
    word_list = []
    all_words = list(wv.key_to_index.keys())
    filtered_count = 0
    
    for word in all_words:
        # Apply all filters
        if (word.lower() not in stop_words and
            is_ascii_only(word) and
            is_english(word) and
            not is_nsfw(word)):
            word_list.append(word)
            if len(word_list) >= num_words:
                break
        else:
            filtered_count += 1
            # Print progress every 10000 filtered words
            if filtered_count % 10000 == 0:
                print(f"   Processed {filtered_count} words, found {len(word_list)} valid words so far...")
    
    print(f"   Filtered through {filtered_count + len(word_list)} words to find {len(word_list)} valid words.")
    
    # Initialize a list to hold the data rows
    data_rows = []

    print(f"5. Formatting data for {len(word_list)} words...")

    for word in word_list:
        # Get the vector (which is a numpy array)
        vector = wv[word]
        
        # Create the row: [word, vector[0], vector[1], ..., vector[D-1]]
        # We use np.insert to easily prepend the word string to the vector array
        row = np.insert(vector.astype(str), 0, word)
        data_rows.append(row)

    # --- CSV Creation ---
    # Convert the list of rows into a pandas DataFrame
    # 1. Create column names: ['word', 'dim_0', 'dim_1', ...]
    num_dimensions = wv.vector_size
    column_names = ['word'] + [f'dim_{i}' for i in range(num_dimensions)]
    
    df = pd.DataFrame(data_rows, columns=column_names)
    
    # Save the DataFrame to a CSV file
    df.to_csv(output_file, index=False, header=True)

    print(f"6. Successfully saved {len(df)} rows to {output_file}")
    print(f"   Model: {model_name}, Dimensions: {num_dimensions}")
    print("\nFile Structure:")
    print(df.head())

# Run the function
if __name__ == "__main__":
    # Allow command line arguments: python word_vec_to_csv.py <model_name> <output_file>
    if len(sys.argv) > 1:
        model_name = sys.argv[1]
    else:
        model_name = DEFAULT_MODEL
    
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    else:
        output_file = DEFAULT_OUTPUT
    
    word_vec_to_csv(model_name, output_file)
