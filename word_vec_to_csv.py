import gensim.downloader as api
import pandas as pd
import numpy as np
import nltk
from nltk.corpus import stopwords
import string
from langdetect import detect, LangDetectException
from better_profanity import profanity

# --- Configuration ---
NUM_WORDS = 1000
OUTPUT_FILE = "top_1000_words_vectors.csv"
MODEL_NAME = "glove-twitter-25" # A small, fast-loading model for demonstration

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

def word_vec_to_csv():
    """Loads a Word2Vec model, extracts the top N words/vectors (excluding stop words), and saves to CSV."""
    
    print(f"1. Downloading and loading model: {MODEL_NAME}...")
    try:
        # Load the KeyedVectors object (the word-to-vector mapping)
        wv = api.load(MODEL_NAME)
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
    # We need to iterate through more words to get NUM_WORDS filtered words
    print(f"4. Extracting top {NUM_WORDS} words (filtering stop words, non-ASCII, non-English, and NSFW words)...")
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
            if len(word_list) >= NUM_WORDS:
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
    df.to_csv(OUTPUT_FILE, index=False, header=True)

    print(f"6. Successfully saved {len(df)} rows to {OUTPUT_FILE}")
    print("\nFile Structure:")
    print(df.head())

# Run the function
if __name__ == "__main__":
    word_vec_to_csv()
