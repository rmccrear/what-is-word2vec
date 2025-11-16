# Cosine Similarity Formulas for Excel and Google Sheets

This document provides formulas to calculate cosine similarity between two word vectors. You can enter words directly, and the formulas will automatically find the row index and calculate similarity.

## File Structure
- **Row 1**: Headers (word, dim_0, dim_1, ..., dim_24)
- **Row 2+**: Data rows (each row contains a word and its 25-dimensional vector)
- **Columns**: 
  - Column A: word
  - Columns B-Z: dim_0 through dim_24 (25 dimensions)

## Cosine Similarity Formula

Cosine similarity = (A · B) / (||A|| × ||B||)

Where:
- A · B = dot product (sum of element-wise multiplication)
- ||A|| = magnitude of vector A (square root of sum of squares)
- ||B|| = magnitude of vector B

---

## Excel Formula

### Basic Formula (assuming vectors are in columns B:Z)

To calculate cosine similarity between row `row1` and row `row2`:

```excel
=SUMPRODUCT(B{row1}:Z{row1},B{row2}:Z{row2})/(SQRT(SUMPRODUCT(B{row1}:Z{row1},B{row1}:Z{row1}))*SQRT(SUMPRODUCT(B{row2}:Z{row2},B{row2}:Z{row2})))
```

### Example: Cosine Similarity Function

**Option 1: Direct cell references**

If you want to compare row 2 (first word) with row 3 (second word):

```excel
=SUMPRODUCT(B2:Z2,B3:Z3)/(SQRT(SUMPRODUCT(B2:Z2,B2:Z2))*SQRT(SUMPRODUCT(B3:Z3,B3:Z3)))
```

**Option 2: Using INDEX for row numbers**

To make it dynamic with row numbers in cells (e.g., row index 1 in A1, row index 2 in B1):

```excel
=SUMPRODUCT(INDEX(B:Z,A1+1,0),INDEX(B:Z,B1+1,0))/(SQRT(SUMPRODUCT(INDEX(B:Z,A1+1,0),INDEX(B:Z,A1+1,0)))*SQRT(SUMPRODUCT(INDEX(B:Z,B1+1,0),INDEX(B:Z,B1+1,0))))
```

Note: `+1` accounts for the header row. If A1=1, it references row 2 (first data row).

**Option 3: Named function (if you want to create a custom function)**

You can create a named formula called `COSINE_SIM`:

1. Go to Formulas > Name Manager > New
2. Name: `COSINE_SIM`
3. Refers to:
```excel
=SUMPRODUCT(INDEX(B:Z,ROW1+1,0),INDEX(B:Z,ROW2+1,0))/(SQRT(SUMPRODUCT(INDEX(B:Z,ROW1+1,0),INDEX(B:Z,ROW1+1,0)))*SQRT(SUMPRODUCT(INDEX(B:Z,ROW2+1,0),INDEX(B:Z,ROW2+1,0))))
```

Then use: `=COSINE_SIM(1,2)` to compare row 1 with row 2 (actual rows 2 and 3 in the sheet).

---

## Google Sheets Formula

### Basic Formula

**Option 1: Direct cell references**

```google-sheets
=SUMPRODUCT(B2:Z2,B3:Z3)/(SQRT(SUMPRODUCT(B2:Z2,B2:Z2))*SQRT(SUMPRODUCT(B3:Z3,B3:Z3)))
```

**Option 2: Using INDEX for row numbers**

If row indices are in cells A1 and B1 (0-indexed from data rows):

```google-sheets
=SUMPRODUCT(INDEX(B:Z,A1+1,0),INDEX(B:Z,B1+1,0))/(SQRT(SUMPRODUCT(INDEX(B:Z,A1+1,0),INDEX(B:Z,A1+1,0)))*SQRT(SUMPRODUCT(INDEX(B:Z,B1+1,0),INDEX(B:Z,B1+1,0))))
```

**Option 3: Custom function using ARRAYFORMULA**

```google-sheets
=SUMPRODUCT(ARRAYFORMULA(INDEX(B:Z,ROW1+1,0)*INDEX(B:Z,ROW2+1,0)))/(SQRT(SUMPRODUCT(ARRAYFORMULA(INDEX(B:Z,ROW1+1,0)^2)))*SQRT(SUMPRODUCT(ARRAYFORMULA(INDEX(B:Z,ROW2+1,0)^2))))
```

---

## Word-Based Input (Recommended)

The easiest way is to enter words directly. The formula will automatically find the row index using MATCH.

### Formula to find row index from word:
```excel
=IF(A2="","",IF(ISNA(MATCH(A2,'Word Vectors'!A:A,0)),"Word not found",MATCH(A2,'Word Vectors'!A:A,0)-1))
```

### Complete cosine similarity formula using words:
Enter words in columns A and C, then use this formula in column E:

```excel
=IF(OR(A2="",C2="",NOT(ISNUMBER(B2)),NOT(ISNUMBER(D2))),"",SUMPRODUCT(INDIRECT("'Word Vectors'!B"&(B2+1)&":Z"&(B2+1)),INDIRECT("'Word Vectors'!B"&(D2+1)&":Z"&(D2+1)))/(SQRT(SUMPRODUCT(INDIRECT("'Word Vectors'!B"&(B2+1)&":Z"&(B2+1)),INDIRECT("'Word Vectors'!B"&(B2+1)&":Z"&(B2+1))))*SQRT(SUMPRODUCT(INDIRECT("'Word Vectors'!B"&(D2+1)&":Z"&(D2+1)),INDIRECT("'Word Vectors'!B"&(D2+1)&":Z"&(D2+1))))))
```

Where:
- Column A: Word 1
- Column B: Row Index 1 (calculated automatically)
- Column C: Word 2  
- Column D: Row Index 2 (calculated automatically)
- Column E: Cosine Similarity

## Usage Examples

### Example 1: Compare words directly (recommended)
Enter "follow" in A2 and "back" in C2. The formulas will automatically find the indices and calculate similarity.

### Example 2: Compare first word (row 2) with second word (row 3) using row numbers

**Excel:**
```excel
=SUMPRODUCT(B2:Z2,B3:Z3)/(SQRT(SUMPRODUCT(B2:Z2,B2:Z2))*SQRT(SUMPRODUCT(B3:Z3,B3:Z3)))
```

**Google Sheets:**
```google-sheets
=SUMPRODUCT(B2:Z2,B3:Z3)/(SQRT(SUMPRODUCT(B2:Z2,B2:Z2))*SQRT(SUMPRODUCT(B3:Z3,B3:Z3)))
```

### Example 2: Create a similarity matrix

Create a table where:
- Column headers: Word indices (1, 2, 3, ...)
- Row headers: Word indices (1, 2, 3, ...)
- Cell formula (assuming row index in column A, column index in row 1):

**Excel:**
```excel
=SUMPRODUCT(INDEX(B:Z,$A2+1,0),INDEX(B:Z,B$1+1,0))/(SQRT(SUMPRODUCT(INDEX(B:Z,$A2+1,0),INDEX(B:Z,$A2+1,0)))*SQRT(SUMPRODUCT(INDEX(B:Z,B$1+1,0),INDEX(B:Z,B$1+1,0))))
```

**Google Sheets:**
```google-sheets
=SUMPRODUCT(INDEX(B:Z,$A2+1,0),INDEX(B:Z,B$1+1,0))/(SQRT(SUMPRODUCT(INDEX(B:Z,$A2+1,0),INDEX(B:Z,$A2+1,0)))*SQRT(SUMPRODUCT(INDEX(B:Z,B$1+1,0),INDEX(B:Z,B$1+1,0))))
```

---

## Notes

1. **Row Indexing**: The formulas use `+1` to account for the header row. If you want to compare the first data row, use index 1 (which becomes row 2 in the sheet).

2. **Result Range**: Cosine similarity returns a value between -1 and 1:
   - **1**: Vectors point in the same direction (most similar)
   - **0**: Vectors are orthogonal (unrelated)
   - **-1**: Vectors point in opposite directions (most dissimilar)

3. **Performance**: For large datasets, consider using array formulas or creating a helper column for vector magnitudes to improve performance.

4. **Alternative: Dot Product Only**: If you only want the dot product (without normalization), use:
   ```excel
   =SUMPRODUCT(B2:Z2,B3:Z3)
   ```

