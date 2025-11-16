import gensim.downloader as api

# Load a pre-trained word2vec model
print("Loading word2vec model...")
model = api.load("glove-twitter-25")  # Small, fast-loading model
print(f"Model loaded! Vocabulary size: {len(model.key_to_index)}\n")

# Words to print vectors for
words = ["king", "queen", "prince", "fox"]

print("Word Vectors:")
print("=" * 80)

for word in words:
    if word in model.key_to_index:
        vector = model[word]
        print(f"\n{word.upper()}:")
        print(f"  Vector dimensions: {len(vector)}")
        print(f"  First 10 values: {vector[:10]}")
        print(f"  Full vector: {vector}")
    else:
        print(f"\n{word.upper()}: Word not found in model vocabulary")

