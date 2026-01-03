# Document Text Extractor API

A powerful FastAPI-based service for extracting text from various document formats including PDFs, images, and Microsoft Office documents. The service uses OCR technology and native parsers to handle multiple file types efficiently.

## Features

- **PDF Text Extraction**: Extract text from PDF files using native parsing and OCR fallback for scanned PDFs
- **Image OCR**: Extract text from images using Tesseract OCR engine
- **Office Document Support**: Extract text from Microsoft Office documents (Word, Excel, PowerPoint)
- **Multiple Image Formats**: Support for JPEG, PNG, GIF, WebP image formats
- **Web UI**: User-friendly drag-and-drop interface for easy document uploads
- **File Size Limits**: Configurable file size validation (default 50MB)
- **Docker Ready**: Containerized application with Docker and Docker Compose support
- **Health Check**: Built-in health monitoring endpoint
- **REST API**: Clean RESTful API with automatic documentation
- **CORS Enabled**: Cross-origin resource sharing for frontend integration

## Supported File Formats

| Category   | Formats                                  | Method                    |
| ---------- | ---------------------------------------- | ------------------------- |
| **PDF**    | `.pdf`                                   | pdfplumber + OCR fallback |
| **Images** | `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` | Tesseract OCR             |
| **Office** | `.docx`, `.xlsx`, `.pptx`                | Native parsers            |

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd document-text-extractor
```

2. Start the service:

```bash
docker-compose up -d
```

3. Access the application:
   - **Web UI**: `http://localhost:8000` - User-friendly interface for document uploads
   - **API Documentation**: `http://localhost:8000/docs` - Interactive API documentation
   - **Health Check**: `http://localhost:8000/health` - Service status

### Manual Installation

1. Install system dependencies:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install tesseract-ocr libtesseract-dev poppler-utils

# macOS
brew install tesseract poppler

# Windows
# Download and install Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Run the application:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Running from PyCharm

**Setup Run Configuration:**

1. Open **Run** → **Edit Configurations...**
2. Click **+** → **Python**
3. Configure as follows:
   - **Name:** `FastAPI - Document Extractor`
   - **Module name:** (select radio button) → `uvicorn`
   - **Parameters:** `app.main:app --reload --host 0.0.0.0 --port 8000`
   - **Working directory:** `/path/to/document-text-extractor`
   - **Environment variables:** `MAX_FILE_SIZE_MB=50;TESSERACT_CMD=tesseract`
4. Click **OK** and run with the green play button

**Alternative - Using Script:**

Create `run.py` in the project root:

```python
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

Then set **Script path** to `run.py` in the run configuration.

## API Documentation

Once the service is running, visit:

- **Interactive API Documentation**: `http://localhost:8000/docs`
- **Alternative Documentation**: `http://localhost:8000/redoc`

## Web UI

The application includes a user-friendly web interface for easy document text extraction:

### Accessing the Web UI

Open your browser and navigate to:

```
http://localhost:8000
```

### Features

- **Drag-and-Drop Upload**: Simply drag your file onto the upload zone or click to browse
- **Supported Formats Display**: Clear indication of all supported file formats
- **Client-Side Validation**: Instant feedback on file size and format before upload
- **Progress Indicator**: Visual feedback during text extraction
- **Result Display**: View extracted text in a textarea with character count
- **Copy to Clipboard**: One-click copy of extracted text
- **Download as TXT**: Save extracted text as a text file
- **Specific Error Messages**: Clear error feedback for troubleshooting

### Supported Formats

The Web UI supports the following file types:

- **PDF**: `.pdf`
- **Office Documents**: `.docx`, `.xlsx`, `.pptx`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

### File Size Limits

- **Default Maximum Size**: 50 MB
- **Configurable**: Can be adjusted via environment variable (see Configuration section)

## API Endpoints

### Health Check

```http
GET /health
```

Returns the service status.

### PDF Text Extraction

```http
POST /extract/pdf
Content-Type: multipart/form-data

file: <PDF_FILE>
```

### Image Text Extraction (OCR)

```http
POST /extract/image
Content-Type: multipart/form-data

file: <IMAGE_FILE>
```

### Office Document Text Extraction

```http
POST /extract/office
Content-Type: multipart/form-data

file: <OFFICE_FILE>
```

## Usage Examples

### Using cURL

**Extract text from PDF:**

```bash
curl -X POST "http://localhost:8000/extract/pdf" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@document.pdf"
```

**Extract text from image:**

```bash
curl -X POST "http://localhost:8000/extract/image" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@image.png"
```

**Extract text from Office document:**

```bash
curl -X POST "http://localhost:8000/extract/office" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@document.docx"
```

### Using Python Requests

```python
import requests

# Extract text from PDF
with open('document.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/extract/pdf',
        files={'file': f}
    )
    text = response.json()['text']
    print(text)
```

## Project Structure

```
document-text-extractor/
├── app/
│   └── main.py          # FastAPI application and endpoints
├── static/
│   ├── index.html       # Web UI interface
│   └── app.js          # Client-side JavaScript logic
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile          # Docker image definition
├── requirements.txt    # Python dependencies
└── README.md          # Project documentation
```

## Dependencies

### Core Libraries

- **FastAPI**: Modern web framework for building APIs
- **uvicorn**: ASGI server for running FastAPI
- **pytesseract**: Python wrapper for Tesseract OCR
- **Pillow**: Image processing library
- **pdfplumber**: PDF text extraction
- **python-multipart**: File upload support

### Office Document Libraries

- **python-docx**: Word document processing
- **openpyxl**: Excel file processing
- **python-pptx**: PowerPoint presentation processing

## Configuration

### Environment Variables

- `TESSERACT_CMD`: Path to Tesseract executable (default: "tesseract")
- `MAX_FILE_SIZE_MB`: Maximum allowed file size in megabytes (default: "50")

### Customizing File Size Limit

To change the maximum file size limit, modify the `docker-compose.yml` file:

```yaml
environment:
  TESSERACT_CMD: "/usr/bin/tesseract"
  MAX_FILE_SIZE_MB: "100"  # Change to desired size in MB
```

Or set it when running manually:

```bash
export MAX_FILE_SIZE_MB=100
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker Configuration

The application is configured to run on port 8000. You can modify the port mapping in [`docker-compose.yml`](docker-compose.yml) if needed.

**Volume Mounts:**
- `./app:/app/app` - Application code
- `./static:/app/static` - Web UI files

## Error Handling

The API provides comprehensive error handling:

- **400 Bad Request**: Invalid file format or corrupted files
- **413 Payload Too Large**: File size exceeds the configured maximum limit
- **500 Internal Server Error**: Processing errors with detailed error messages

The Web UI provides user-friendly error messages for all error scenarios.

## Performance Considerations

- **PDF Processing**: Large PDFs with many images may take longer due to OCR processing
- **Image Quality**: Higher resolution images provide better OCR accuracy
- **Memory Usage**: Processing large files may require sufficient memory allocation

## Development

### Running in Development Mode

**Terminal:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**PyCharm:**
- Use the run configuration setup described in the "Running from PyCharm" section
- Ensure your Python interpreter has all dependencies from `requirements.txt` installed
- The `--reload` flag enables auto-reload on code changes

### Adding New File Formats

To add support for new file formats:

1. Install required libraries in [`requirements.txt`](requirements.txt)
2. Add extraction logic in [`main.py`](app/main.py)
3. Update the API endpoint to handle the new format
4. Update this README with the new supported format

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Berijalan Bootcamp Techno 14 program.

## Troubleshooting

### Common Issues

**Tesseract not found:**

- Ensure Tesseract is installed and accessible in your system PATH
- Set the `TESSERACT_CMD` environment variable to the correct path

**Memory errors with large files:**

- Increase Docker memory limits if using containers
- Consider implementing file size limits for your use case

**Poor OCR accuracy:**

- Ensure images have sufficient resolution (300+ DPI recommended)
- Preprocess images to improve contrast and clarity
