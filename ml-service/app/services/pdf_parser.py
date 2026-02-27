import io
import fitz  # PyMuPDF

def extract_text(pdf_bytes: bytes) -> str:
    """
    Extract text content from a PDF file.
    
    Args:
        pdf_bytes (bytes): The raw bytes of the PDF file.
        
    Returns:
        str: The extracted text.
    """
    text = ""
    try:
        # Open the PDF from bytes
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        # Iterate through pages and extract text
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text += page.get_text("text") + "\n"
            
        pdf_document.close()
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {str(e)}")
        # In a real app, you might want to re-raise or handle this differently
        return ""
