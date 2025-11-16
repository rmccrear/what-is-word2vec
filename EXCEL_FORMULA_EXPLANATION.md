# Excel Formula Explanation: Cosine Similarity Calculation

## Overview

This document explains the complex Excel formula used in the "Top Matches" sheet to calculate cosine similarity between word vectors. The formula computes how similar two words are based on their 25-dimensional vector representations.

## The Complete Formula

```excel
=IF(OR($B$2="",ISNA(MATCH($B$2,'Word Vectors'!A:A,0)),'Word Vectors'!A5=$B$2),"",SUMPRODUCT(INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0)),INDIRECT("'Word Vectors'!B5:Z5"))/(SQRT(SUMPRODUCT(INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0)),INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0))))*SQRT(SUMPRODUCT(INDIRECT("'Word Vectors'!B5:Z5"),INDIRECT("'Word Vectors'!B5:Z5")))))
```

## What It Does

This formula calculates the **cosine similarity** between:
1. The word entered in cell B2 (the input word)
2. The word in row 5 of the "Word Vectors" sheet (one of the words in the database)

The result is a number between -1 and 1, where:
- **1** = identical vectors (most similar)
- **0** = orthogonal vectors (unrelated)
- **-1** = opposite vectors (most dissimilar)

## Component Breakdown

### Part 1: Error Checking (IF/OR Statement)

```excel
IF(OR($B$2="",ISNA(MATCH($B$2,'Word Vectors'!A:A,0)),'Word Vectors'!A5=$B$2),"",...)
```

**Purpose**: Checks for three error conditions before calculating similarity.

**Conditions**:
1. `$B$2=""` - Checks if the input cell is empty
2. `ISNA(MATCH($B$2,'Word Vectors'!A:A,0))` - Checks if the word in B2 doesn't exist in the database
3. `'Word Vectors'!A5=$B$2` - Checks if we're comparing the word to itself (row 5 = input word)

**Result**: If any condition is true, returns empty string `""`. Otherwise, proceeds to calculation.

### Part 2: Finding the Input Word's Row (MATCH Function)

```excel
MATCH($B$2,'Word Vectors'!A:A,0)
```

**Purpose**: Finds which row contains the word entered in B2.

**How it works**:
- Searches column A of "Word Vectors" sheet for the exact match (`0` = exact match)
- Returns the row number where the word is found
- Example: If "follow" is in row 2, returns `2`

**Used multiple times**: This calculation is repeated several times in the formula (for efficiency, Excel may cache it).

### Part 3: Building Dynamic Range References (INDIRECT Function)

```excel
INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0))
```

**Purpose**: Creates a reference to the vector dimensions (columns B through Z) for the input word.

**How it works**:
- `"B"&MATCH(...)&":Z"&MATCH(...)` builds a string like `"B2:Z2"`
- `INDIRECT()` converts that string into an actual cell range reference
- Result: References columns B-Z for the row containing the input word

**Example**: If input word is in row 2, this becomes `'Word Vectors'!B2:Z2` (all 25 dimensions).

### Part 4: Dot Product Calculation (SUMPRODUCT)

```excel
SUMPRODUCT(INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0)),INDIRECT("'Word Vectors'!B5:Z5"))
```

**Purpose**: Calculates the dot product (sum of element-wise multiplication) of the two vectors.

**Mathematical formula**: 
```
dot_product = Σ(vector1[i] × vector2[i]) for i = 0 to 24
```

**How it works**:
- First range: Input word's vector (B2:Z2, dynamically determined)
- Second range: Comparison word's vector (B5:Z5, fixed to row 5)
- Multiplies corresponding elements and sums them

**Example**:
- Vector 1: [0.003, 0.915, -1.221, ...]
- Vector 2: [-0.744, 0.715, -0.159, ...]
- Dot product: (0.003 × -0.744) + (0.915 × 0.715) + (-1.221 × -0.159) + ...

### Part 5: Vector Magnitude Calculation (SQRT + SUMPRODUCT)

```excel
SQRT(SUMPRODUCT(INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0)),INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0))))
```

**Purpose**: Calculates the magnitude (length) of the input word's vector.

**Mathematical formula**: 
```
magnitude = √(Σ(vector[i]²)) = √(vector · vector)
```

**How it works**:
- Uses SUMPRODUCT to multiply the vector by itself (dot product with itself)
- Takes square root to get the magnitude
- This is done twice: once for input word, once for comparison word

**Example**: If vector is [3, 4], magnitude = √(3² + 4²) = √25 = 5

### Part 6: Cosine Similarity Formula (Final Division)

```excel
dot_product / (magnitude1 × magnitude2)
```

**Purpose**: Normalizes the dot product by the product of vector magnitudes.

**Mathematical formula**: 
```
cosine_similarity = (A · B) / (||A|| × ||B||)
```

**How it works**:
- Divides the dot product by the product of both vector magnitudes
- This normalizes the result to the range [-1, 1]
- Accounts for vector length, focusing on direction (angle) rather than magnitude

## Complete Formula Walkthrough

Let's trace through an example where:
- Input word in B2: "follow" (found in row 2)
- Comparison word: Row 5 contains "back"

### Step 1: Error Check
```
IF(OR(B2="", ISNA(MATCH(...)), A5=B2), "", ...)
→ Checks: B2 not empty ✓, word found ✓, not comparing to self ✓
→ Proceeds to calculation
```

### Step 2: Find Input Word Row
```
MATCH("follow", 'Word Vectors'!A:A, 0)
→ Returns: 2
```

### Step 3: Build Vector References
```
Input vector: INDIRECT("B2:Z2") → 'Word Vectors'!B2:Z2
Comparison vector: INDIRECT("B5:Z5") → 'Word Vectors'!B5:Z5
```

### Step 4: Calculate Dot Product
```
SUMPRODUCT(B2:Z2, B5:Z5)
→ Multiplies each corresponding dimension and sums
→ Result: e.g., 12.345
```

### Step 5: Calculate Magnitudes
```
Magnitude 1: SQRT(SUMPRODUCT(B2:Z2, B2:Z2)) → e.g., 5.678
Magnitude 2: SQRT(SUMPRODUCT(B5:Z5, B5:Z5)) → e.g., 4.321
```

### Step 6: Calculate Cosine Similarity
```
12.345 / (5.678 × 4.321)
= 12.345 / 24.536
= 0.503
```

**Result**: Cosine similarity = 0.503 (moderately similar)

## Visual Representation

```
Input Word Vector:     [v1₁, v1₂, v1₃, ..., v1₂₅]
Comparison Word Vector: [v2₁, v2₂, v2₃, ..., v2₂₅]

Dot Product = v1₁×v2₁ + v1₂×v2₂ + ... + v1₂₅×v2₂₅

Magnitude 1 = √(v1₁² + v1₂² + ... + v1₂₅²)
Magnitude 2 = √(v2₁² + v2₂² + ... + v2₂₅²)

Cosine Similarity = Dot Product / (Magnitude 1 × Magnitude 2)
```

## Why This Formula is Complex

1. **Dynamic References**: Uses INDIRECT to build cell references based on the input word
2. **Error Handling**: Checks multiple conditions before calculating
3. **Repeated Calculations**: MATCH is called multiple times (could be optimized with helper cells)
4. **Nested Functions**: Multiple levels of nesting make it hard to read

## Performance Considerations

- **MATCH Function**: Called 4 times for the same lookup (could use a helper cell)
- **INDIRECT Function**: Can be slow with large datasets (1000 words = 1000 formulas)
- **SUMPRODUCT**: Efficient for array operations in Excel

## Tips for Understanding

1. **Break it down**: Copy parts of the formula to separate cells to see intermediate results
2. **Use Formula Evaluation**: Excel's "Evaluate Formula" tool (Formulas → Formula Auditing)
3. **Helper Columns**: Consider using helper columns for MATCH results to simplify the formula
4. **Test with Known Values**: Try with words you know are similar to verify results

## Related Formulas

This formula is used in the helper columns (D onwards) of the "Top Matches" sheet. Each helper column calculates similarity between the input word and one word from the database. The LARGE function then finds the top 10 highest similarity scores.

## Mathematical Background

Cosine similarity measures the cosine of the angle between two vectors in high-dimensional space. It's commonly used in:
- Natural language processing (word embeddings)
- Information retrieval (document similarity)
- Machine learning (feature comparison)

The formula ensures that words with similar meanings (similar vector directions) have high similarity scores, regardless of the magnitude of their vectors.

