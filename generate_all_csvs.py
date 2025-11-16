from word_vec_to_csv import word_vec_to_csv

# Generate Twitter dataset
print("=" * 60)
print("Generating Twitter dataset (glove-twitter-25)...")
print("=" * 60)
word_vec_to_csv("glove-twitter-25", "top_1000_words_vectors_twitter.csv", num_words=1000)

print("\n")

# Generate Wiki dataset (5000 words)
print("=" * 60)
print("Generating Wiki dataset (glove-wiki-gigaword-50) with 5000 words...")
print("=" * 60)
word_vec_to_csv("glove-wiki-gigaword-50", "top_5000_words_vectors_wiki.csv", num_words=5000)

