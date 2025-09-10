# Document Text Extractor API

A powerful FastAPI-based service for extracting text from various document formats including PDFs, images, and Microsoft Office documents. The service uses OCR technology and native parsers to handle multiple file types efficiently.

## Features

- **PDF Text Extraction**: Extract text from PDF files using native parsing and OCR fallback for scanned PDFs
- **Image OCR**: Extract text from images using Tesseract OCR engine
- **Office Document Support**: Extract text from Microsoft Office documents (Word, Excel, PowerPoint)
- **Multiple Image Formats**: Support for JPEG, PNG, GIF, WebP image formats
- **Docker Ready**: Containerized application with Docker and Docker Compose support
- **Health Check**: Built-in health monitoring endpoint
- **REST API**: Clean RESTful API with automatic documentation

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

3. The API will be available at `http://localhost:8000`

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

## API Documentation

Once the service is running, visit:

- **Interactive API Documentation**: `http://localhost:8000/docs`
- **Alternative Documentation**: `http://localhost:8000/redoc`

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
│   ├── main.py          # FastAPI application and endpoints
│   ├── routers.py       # Additional route definitions (if any)
│   └── utils.py         # Utility functions (if any)
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

### Docker Configuration

The application is configured to run on port 8000. You can modify the port mapping in [`docker-compose.yml`](docker-compose.yml) if needed.

## Error Handling

The API provides comprehensive error handling:

- **400 Bad Request**: Invalid file format or corrupted files
- **500 Internal Server Error**: Processing errors with detailed error messages

## Performance Considerations

- **PDF Processing**: Large PDFs with many images may take longer due to OCR processing
- **Image Quality**: Higher resolution images provide better OCR accuracy
- **Memory Usage**: Processing large files may require sufficient memory allocation

## Development

### Running in Development Mode

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

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
