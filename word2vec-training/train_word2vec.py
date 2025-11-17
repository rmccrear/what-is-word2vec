"""
Train a Word2Vec model using the text8 corpus.

This script downloads the text8 corpus and trains a Word2Vec model
with the specified parameters.
"""

from gensim.models import Word2Vec
from gensim import downloader as api
import os
import gzip

def train_word2vec():
    """Train a Word2Vec model on the text8 corpus."""
    
    print("=" * 60)
    print("Word2Vec Training Script")
    print("=" * 60)
    
    # Download text8 corpus
    print("\n1. Downloading text8 corpus...")
    corpus_path = api.load("text8", return_path=True)
    print(f"   Corpus downloaded to: {corpus_path}")
    
    # Read the corpus (text8 is a single line of space-separated words, compressed as .gz)
    print("\n2. Loading corpus...")
    with gzip.open(corpus_path, 'rt', encoding='utf-8') as f:
        text = f.read()
    
    # Split into sentences (text8 is already tokenized, so we split by spaces)
    # For Word2Vec, we need a list of sentences, where each sentence is a list of words
    # text8 is one long line, so we'll split it into chunks of ~1000 words per sentence
    print("3. Preparing sentences...")
    words = text.split()
    chunk_size = 1000
    corpus = []
    for i in range(0, len(words), chunk_size):
        sentence = words[i:i + chunk_size]
        corpus.append(sentence)
    
    print(f"   Created {len(corpus)} sentences from {len(words)} words")
    
    # Train Word2Vec model
    print("\n4. Training Word2Vec model...")
    print("   Parameters:")
    print("   - vector_size: 50")
    print("   - window: 5")
    print("   - min_count: 30")
    print("   - workers: 4")
    print("   - max_final_vocab: 5000")
    print("\n   Training (this may take a few minutes)...")
    
    model = Word2Vec(
        corpus,              # your text8 sentences
        vector_size=50,      # each word becomes a 50-dimension vector
        window=5,            # context window of 5 words on each side
        min_count=30,        # ignore words that appear <30 times
        workers=4,           # train using 4 CPU threads
        max_final_vocab=5000 # cap vocab around 5000 words
    )
    
    print("\n5. Training complete!")
    print(f"   Vocabulary size: {len(model.wv.key_to_index)}")
    
    # Save the model
    output_file = "word2vec_model.model"
    print(f"\n6. Saving model to: {output_file}")
    model.save(output_file)
    print(f"   Model saved successfully!")
    
    # Test the model
    print("\n7. Testing the model...")
    if len(model.wv.key_to_index) > 0:
        # Get a sample word
        sample_word = list(model.wv.key_to_index.keys())[0]
        print(f"   Sample word: '{sample_word}'")
        print(f"   Vector shape: {model.wv[sample_word].shape}")
        
        # Find most similar words
        if len(model.wv.key_to_index) > 1:
            try:
                similar = model.wv.most_similar(sample_word, topn=5)
                print(f"   Most similar words to '{sample_word}':")
                for word, score in similar:
                    print(f"     - {word}: {score:.4f}")
            except Exception as e:
                print(f"   Could not find similar words: {e}")
    
    print("\n" + "=" * 60)
    print("Training complete!")
    print("=" * 60)
    
    return model

if __name__ == "__main__":
    model = train_word2vec()

