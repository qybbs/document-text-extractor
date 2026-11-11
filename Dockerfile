# ---- builder ----
FROM python:3.11-slim AS builder

WORKDIR /app

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Build options:
#   INSTALL_EASYOCR=true  -> adds easyocr (+torch/torchvision). Default false = lean tesseract-only image.
#   USE_GPU=true          -> GPU torch wheel. Default false = CPU-only (no nvidia cuda packages).
ARG INSTALL_EASYOCR=false
ARG USE_GPU=false
RUN if [ "$INSTALL_EASYOCR" = "true" ]; then \
        if [ "$USE_GPU" = "true" ]; then \
            pip install --no-cache-dir torch torchvision easyocr; \
        else \
            pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu && \
            pip install --no-cache-dir easyocr; \
        fi; \
    fi

# ---- runtime ----
FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
