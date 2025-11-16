import pandas as pd
from openpyxl import load_workbook
from openpyxl.utils import get_column_letter
from openpyxl.styles import Font
import os

def create_excel_with_formulas(csv_file="top_1000_words_vectors.csv", output_file="word_vectors_with_formulas.xlsx"):
    """Create an Excel file with the word vectors and cosine similarity formulas."""
    
    # Read the CSV file
    print(f"Reading {csv_file}...")
    df = pd.read_csv(csv_file)
    
    # Create Excel writer
    print(f"Creating Excel file: {output_file}...")
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        # Write the main data
        df.to_excel(writer, sheet_name='Word Vectors', index=False)
        
        # Create a sheet for cosine similarity calculations
        similarity_df = pd.DataFrame({
            'Word 1': [],
            'Row Index 1': [],
            'Word 2': [],
            'Row Index 2': [],
            'Cosine Similarity': []
        })
        similarity_df.to_excel(writer, sheet_name='Cosine Similarity', index=False)
        
        # Create a template sheet with instructions
        instructions = pd.DataFrame({
            'Instructions': [
                'COSINE SIMILARITY FORMULAS',
                '',
                'To calculate cosine similarity between two vectors by row index:',
                '',
                'Method 1: Direct cell reference',
                '=SUMPRODUCT(B2:Z2,B3:Z3)/(SQRT(SUMPRODUCT(B2:Z2,B2:Z2))*SQRT(SUMPRODUCT(B3:Z3,B3:Z3)))',
                '',
                'Method 2: Using INDEX with row numbers',
                'If row indices are in cells A1 and B1:',
                '=SUMPRODUCT(INDEX(B:Z,A1+1,0),INDEX(B:Z,B1+1,0))/(SQRT(SUMPRODUCT(INDEX(B:Z,A1+1,0),INDEX(B:Z,A1+1,0)))*SQRT(SUMPRODUCT(INDEX(B:Z,B1+1,0),INDEX(B:Z,B1+1,0))))',
                '',
                'Note: +1 accounts for the header row. Row index 1 = actual row 2 in sheet.',
                '',
                'Example: To compare first word (row 2) with second word (row 3):',
                '=SUMPRODUCT(B2:Z2,B3:Z3)/(SQRT(SUMPRODUCT(B2:Z2,B2:Z2))*SQRT(SUMPRODUCT(B3:Z3,B3:Z3)))',
                '',
                'Result range: -1 to 1',
                '1 = most similar, 0 = orthogonal, -1 = most dissimilar'
            ]
        })
        instructions.to_excel(writer, sheet_name='Instructions', index=False)
        
        # Create a sheet for finding top matches
        top_matches_df = pd.DataFrame({
            'Rank': [str(i) for i in range(1, 11)],
            'Word': [''] * 10,
            'Similarity': [''] * 10
        })
        top_matches_df.to_excel(writer, sheet_name='Top Matches', index=False)
    
    # Now add formulas to the Cosine Similarity sheet
    print("Adding formulas to Excel file...")
    wb = load_workbook(output_file)
    ws_similarity = wb['Cosine Similarity']
    
    # Add documentation header
    from openpyxl.styles import Alignment
    ws_similarity.cell(row=1, column=1).value = "COSINE SIMILARITY CALCULATOR"
    ws_similarity.cell(row=1, column=1).font = Font(bold=True, size=14)
    ws_similarity.merge_cells('A1:E1')
    ws_similarity.cell(row=1, column=1).alignment = Alignment(horizontal='center')
    
    ws_similarity.cell(row=2, column=1).value = "Instructions:"
    ws_similarity.cell(row=2, column=1).font = Font(bold=True)
    instructions_text = "Enter two words in columns A and C (starting from row 5). The sheet will automatically calculate the cosine similarity between their word vectors. Similarity ranges from -1 (opposite) to 1 (identical), with 0 meaning orthogonal/unrelated."
    ws_similarity.cell(row=2, column=2).value = instructions_text
    ws_similarity.merge_cells('B2:E2')
    ws_similarity.cell(row=2, column=2).alignment = Alignment(wrap_text=True, vertical='top')
    
    # Add header row with better formatting (now at row 4)
    headers = ['Word 1', 'Row Index 1', 'Word 2', 'Row Index 2', 'Cosine Similarity']
    for col_idx, header in enumerate(headers, start=1):
        cell = ws_similarity.cell(row=4, column=col_idx)
        cell.value = header
        cell.font = Font(bold=True)
    
    # Add example rows with formulas (starting at row 5)
    # Row 5: Example comparing two words
    ws_similarity.cell(row=5, column=1).value = "follow"  # Word 1 - example
    # Find row index using MATCH
    ws_similarity.cell(row=5, column=2).value = "=IF(A5=\"\",\"\",MATCH(A5,'Word Vectors'!A:A,0)-1)"  # Row Index 1 (0-indexed)
    ws_similarity.cell(row=5, column=3).value = "back"  # Word 2 - example
    ws_similarity.cell(row=5, column=4).value = "=IF(C5=\"\",\"\",MATCH(C5,'Word Vectors'!A:A,0)-1)"  # Row Index 2 (0-indexed)
    # Cosine similarity formula using row indices from columns B and D
    # B5 and D5 contain 0-indexed row numbers, so we add 1 for actual row numbers in INDIRECT
    formula = "=IF(OR(A5=\"\",C5=\"\",NOT(ISNUMBER(B5)),NOT(ISNUMBER(D5))),\"\",SUMPRODUCT(INDIRECT(\"'Word Vectors'!B\"&(B5+1)&\":Z\"&(B5+1)),INDIRECT(\"'Word Vectors'!B\"&(D5+1)&\":Z\"&(D5+1)))/(SQRT(SUMPRODUCT(INDIRECT(\"'Word Vectors'!B\"&(B5+1)&\":Z\"&(B5+1)),INDIRECT(\"'Word Vectors'!B\"&(B5+1)&\":Z\"&(B5+1))))*SQRT(SUMPRODUCT(INDIRECT(\"'Word Vectors'!B\"&(D5+1)&\":Z\"&(D5+1)),INDIRECT(\"'Word Vectors'!B\"&(D5+1)&\":Z\"&(D5+1))))))"
    ws_similarity.cell(row=5, column=5).value = formula
    
    # Row 6: Template with cell references for easy copying
    ws_similarity.cell(row=6, column=1).value = ""  # Word 1 - user enters here
    ws_similarity.cell(row=6, column=2).value = "=IF(A6=\"\",\"\",IF(ISNA(MATCH(A6,'Word Vectors'!A:A,0)),\"Word not found\",MATCH(A6,'Word Vectors'!A:A,0)-1))"  # Row Index 1
    ws_similarity.cell(row=6, column=3).value = ""  # Word 2 - user enters here
    ws_similarity.cell(row=6, column=4).value = "=IF(C6=\"\",\"\",IF(ISNA(MATCH(C6,'Word Vectors'!A:A,0)),\"Word not found\",MATCH(C6,'Word Vectors'!A:A,0)-1))"  # Row Index 2
    # Cosine similarity formula - uses row indices from columns B and D (more efficient)
    # B6 and D6 contain 0-indexed row numbers, so we add 1 for actual row numbers in INDIRECT
    formula_template = "=IF(OR(A6=\"\",C6=\"\",NOT(ISNUMBER(B6)),NOT(ISNUMBER(D6))),\"\",SUMPRODUCT(INDIRECT(\"'Word Vectors'!B\"&(B6+1)&\":Z\"&(B6+1)),INDIRECT(\"'Word Vectors'!B\"&(D6+1)&\":Z\"&(D6+1)))/(SQRT(SUMPRODUCT(INDIRECT(\"'Word Vectors'!B\"&(B6+1)&\":Z\"&(B6+1)),INDIRECT(\"'Word Vectors'!B\"&(B6+1)&\":Z\"&(B6+1))))*SQRT(SUMPRODUCT(INDIRECT(\"'Word Vectors'!B\"&(D6+1)&\":Z\"&(D6+1)),INDIRECT(\"'Word Vectors'!B\"&(D6+1)&\":Z\"&(D6+1))))))"
    ws_similarity.cell(row=6, column=5).value = formula_template
    
    # Add helpful notes
    ws_similarity.cell(row=7, column=1).value = "Tip:"
    ws_similarity.cell(row=7, column=1).font = Font(bold=True, italic=True)
    tip_text = "You can copy row 6 down to compare multiple word pairs. If a word is not found in the database, 'Word not found' will be displayed."
    ws_similarity.cell(row=7, column=2).value = tip_text
    ws_similarity.merge_cells('B7:E7')
    ws_similarity.cell(row=7, column=2).alignment = Alignment(wrap_text=True, vertical='top')
    ws_similarity.cell(row=7, column=2).font = Font(italic=True)
    
    # Adjust column widths
    ws_similarity.column_dimensions['A'].width = 15
    ws_similarity.column_dimensions['B'].width = 20
    ws_similarity.column_dimensions['C'].width = 15
    ws_similarity.column_dimensions['D'].width = 20
    ws_similarity.column_dimensions['E'].width = 25
    
    # Now add formulas to the Top Matches sheet
    print("Adding formulas to Top Matches sheet...")
    ws_top = wb['Top Matches']
    
    # Add title and documentation
    ws_top.cell(row=1, column=1).value = "TOP 10 SIMILAR WORDS FINDER"
    ws_top.cell(row=1, column=1).font = Font(bold=True, size=14)
    ws_top.merge_cells('A1:C1')
    ws_top.cell(row=1, column=1).alignment = Alignment(horizontal='center')
    
    # Add input section with instructions
    ws_top.cell(row=2, column=1).value = "Enter a word:"
    ws_top.cell(row=2, column=1).font = Font(bold=True)
    ws_top.cell(row=2, column=2).value = ""  # User enters word here
    
    ws_top.cell(row=3, column=1).value = "Instructions:"
    ws_top.cell(row=3, column=1).font = Font(bold=True)
    top_instructions = "Enter any word from the database in cell B2. The sheet will automatically find the top 10 most similar words based on cosine similarity of their word vectors. Results appear below."
    ws_top.cell(row=3, column=2).value = top_instructions
    ws_top.merge_cells('B3:C3')
    ws_top.cell(row=3, column=2).alignment = Alignment(wrap_text=True, vertical='top')
    
    # Add headers (now at row 5)
    headers_top = ['Rank', 'Word', 'Similarity']
    for col_idx, header in enumerate(headers_top, start=1):
        cell = ws_top.cell(row=5, column=col_idx)
        cell.value = header
        cell.font = Font(bold=True)
    
    # Get the number of words (rows in Word Vectors sheet)
    num_words = len(df)
    
    # Create helper columns for similarities (columns D onwards)
    # Each column calculates similarity between input word and one word from the list
    print(f"  Creating {num_words} helper columns for similarity calculations...")
    for i in range(num_words):
        col_letter = get_column_letter(4 + i)  # Start from column D
        word_row = i + 2  # Word Vectors sheet rows start at 2 (row 1 is header)
        
        # Formula to calculate similarity between input word and this word
        # Exclude the input word itself (empty string if same word)
        similarity_formula = f"""=IF(OR($B$2="",ISNA(MATCH($B$2,'Word Vectors'!A:A,0)),'Word Vectors'!A{word_row}=$B$2),"",SUMPRODUCT(INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0)),INDIRECT("'Word Vectors'!B{word_row}:Z{word_row}"))/(SQRT(SUMPRODUCT(INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0)),INDIRECT("'Word Vectors'!B"&MATCH($B$2,'Word Vectors'!A:A,0)&":Z"&MATCH($B$2,'Word Vectors'!A:A,0))))*SQRT(SUMPRODUCT(INDIRECT("'Word Vectors'!B{word_row}:Z{word_row}"),INDIRECT("'Word Vectors'!B{word_row}:Z{word_row}")))))"""
        
        # Put formula in row 2 (we'll hide these columns later)
        ws_top.cell(row=2, column=4+i).value = similarity_formula
    
    # Now create formulas for top 10 matches using LARGE on the helper columns
    last_col = get_column_letter(4 + num_words - 1)
    for rank in range(1, 11):
        row_num = 5 + rank  # Start at row 6 (after header at row 5)
        
        # Rank column
        ws_top.cell(row=row_num, column=1).value = rank
        
        # Similarity value (rank-th largest)
        similarity_formula = f"""=IF(OR($B$2="",ISNA(MATCH($B$2,'Word Vectors'!A:A,0))),"",LARGE(D2:{last_col}2,{rank}))"""
        ws_top.cell(row=row_num, column=3).value = similarity_formula
        
        # Word - find which word has this similarity value
        # MATCH finds the column index, then we add 1 to get the row number in Word Vectors sheet
        word_formula = f"""=IF(OR($B$2="",ISNA(MATCH($B$2,'Word Vectors'!A:A,0)),C{row_num}=""),"",INDEX('Word Vectors'!A:A,MATCH(C{row_num},D2:{last_col}2,0)+1))"""
        ws_top.cell(row=row_num, column=2).value = word_formula
    
    # Add helpful note at the bottom
    note_row = 5 + 11  # After the 10 results
    ws_top.cell(row=note_row, column=1).value = "Note:"
    ws_top.cell(row=note_row, column=1).font = Font(bold=True, italic=True)
    note_text = "Similarity scores range from -1 to 1. Higher values indicate more similar words. The input word itself is excluded from results."
    ws_top.cell(row=note_row, column=2).value = note_text
    ws_top.merge_cells(f'B{note_row}:C{note_row}')
    ws_top.cell(row=note_row, column=2).alignment = Alignment(wrap_text=True, vertical='top')
    ws_top.cell(row=note_row, column=2).font = Font(italic=True)
    
    # Hide helper columns (D onwards)
    for i in range(num_words):
        col_letter = get_column_letter(4 + i)
        ws_top.column_dimensions[col_letter].hidden = True
    
    # Adjust column widths for visible columns
    ws_top.column_dimensions['A'].width = 10
    ws_top.column_dimensions['B'].width = 20
    ws_top.column_dimensions['C'].width = 15
    
    wb.save(output_file)
    print(f"✓ Excel file created: {output_file}")
    print(f"  - Sheet 'Word Vectors': Contains all word vectors")
    print(f"  - Sheet 'Cosine Similarity': Contains formulas ready to use")
    print(f"  - Sheet 'Top Matches': Enter a word in B2 to find top 10 similar words")
    print(f"  - Sheet 'Instructions': Contains formula documentation")

if __name__ == "__main__":
    create_excel_with_formulas()

