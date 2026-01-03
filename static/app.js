// API Configuration
const API_BASE_URL = 'http://localhost:8000';
let maxFileSizeBytes = 50 * 1024 * 1024; // Default 50MB
let selectedFile = null;

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadPrompt = document.getElementById('uploadPrompt');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const changeFileBtn = document.getElementById('changeFileBtn');
const extractBtn = document.getElementById('extractBtn');
const progressContainer = document.getElementById('progressContainer');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const closeError = document.getElementById('closeError');
const resultCard = document.getElementById('resultCard');
const resultText = document.getElementById('resultText');
const charCount = document.getElementById('charCount');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const extractAnotherBtn = document.getElementById('extractAnotherBtn');
const maxFileSizeDisplay = document.getElementById('maxFileSize');

// Supported formats
const SUPPORTED_FORMATS = {
    pdf: ['.pdf'],
    office: ['.docx', '.xlsx', '.pptx'],
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

// Initialize
async function init() {
    try {
        const response = await fetch(`${API_BASE_URL}/config`);
        const config = await response.json();
        maxFileSizeBytes = config.max_file_size_bytes;
        maxFileSizeDisplay.textContent = `${config.max_file_size_mb} MB`;
    } catch (error) {
        console.error('Failed to fetch config:', error);
        showError('Failed to connect to the API. Please make sure the server is running.');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Get file extension
function getFileExtension(filename) {
    return '.' + filename.split('.').pop().toLowerCase();
}

// Validate file
function validateFile(file) {
    const ext = getFileExtension(file.name);
    
    // Check file type
    const allSupportedFormats = [...SUPPORTED_FORMATS.pdf, ...SUPPORTED_FORMATS.office, ...SUPPORTED_FORMATS.image];
    if (!allSupportedFormats.includes(ext)) {
        return {
            valid: false,
            error: `Unsupported file format "${ext}". Supported formats: ${allSupportedFormats.join(', ')}`
        };
    }
    
    // Check file size
    if (file.size > maxFileSizeBytes) {
        return {
            valid: false,
            error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxFileSizeBytes)})`
        };
    }
    
    return { valid: true };
}

// Determine API endpoint based on file type
function getEndpointForFile(file) {
    const ext = getFileExtension(file.name);
    
    if (SUPPORTED_FORMATS.pdf.includes(ext)) {
        return '/extract/pdf';
    } else if (SUPPORTED_FORMATS.office.includes(ext)) {
        return '/extract/office';
    } else if (SUPPORTED_FORMATS.image.includes(ext)) {
        return '/extract/image';
    }
    
    return null;
}

// Show error
function showError(message) {
    errorMessage.textContent = message;
    errorAlert.classList.remove('hidden');
}

// Hide error
function hideError() {
    errorAlert.classList.add('hidden');
}

// Show file info
function showFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    uploadPrompt.classList.add('hidden');
    fileInfo.classList.remove('hidden');
    extractBtn.classList.remove('hidden');
}

// Reset upload zone
function resetUploadZone() {
    selectedFile = null;
    fileInput.value = '';
    uploadPrompt.classList.remove('hidden');
    fileInfo.classList.add('hidden');
    extractBtn.classList.add('hidden');
    resultCard.classList.add('hidden');
    hideError();
}

// Handle file selection
function handleFileSelect(file) {
    hideError();
    
    const validation = validateFile(file);
    if (!validation.valid) {
        showError(validation.error);
        return;
    }
    
    selectedFile = file;
    showFileInfo(file);
}

// Extract text from file
async function extractText() {
    if (!selectedFile) return;
    
    hideError();
    extractBtn.disabled = true;
    progressContainer.classList.remove('hidden');
    
    const endpoint = getEndpointForFile(selectedFile);
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            let errorMsg = 'Failed to extract text from document';
            
            if (response.status === 413) {
                errorMsg = `File too large: ${errorData.detail || 'File size exceeds the maximum allowed size'}`;
            } else if (response.status === 400) {
                errorMsg = `Invalid file: ${errorData.detail || 'The file format is not supported or is corrupted'}`;
            } else if (response.status === 500) {
                errorMsg = `Processing error: ${errorData.detail || 'Failed to process the document. Please try again.'}`;
            } else {
                errorMsg = errorData.detail || errorMsg;
            }
            
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        displayResult(data.text);
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Network error: Unable to connect to the server. Please ensure the API is running.');
        } else {
            showError(error.message);
        }
    } finally {
        progressContainer.classList.add('hidden');
        extractBtn.disabled = false;
    }
}

// Display result
function displayResult(text) {
    resultText.value = text;
    charCount.textContent = text.length.toLocaleString();
    resultCard.classList.remove('hidden');
    
    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Copy to clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(resultText.value);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Copied!</span>
        `;
        copyBtn.classList.add('bg-green-100', 'text-green-700');
        copyBtn.classList.remove('bg-gray-100', 'text-gray-700');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('bg-green-100', 'text-green-700');
            copyBtn.classList.add('bg-gray-100', 'text-gray-700');
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
}

// Download as text file
function downloadText() {
    const blob = new Blob([resultText.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${selectedFile.name.split('.')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Event Listeners
uploadZone.addEventListener('click', () => {
    if (!uploadPrompt.classList.contains('hidden')) {
        fileInput.click();
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileSelect(file);
    }
});

changeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

// Drag and drop
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        handleFileSelect(file);
    }
});

extractBtn.addEventListener('click', extractText);

copyBtn.addEventListener('click', copyToClipboard);

downloadBtn.addEventListener('click', downloadText);

extractAnotherBtn.addEventListener('click', resetUploadZone);

closeError.addEventListener('click', hideError);

// Initialize on page load
init();
