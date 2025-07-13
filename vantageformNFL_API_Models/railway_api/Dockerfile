FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for LightGBM
RUN apt-get update && apt-get install -y \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app
COPY . .

# Debug: List all files in the container
RUN echo "Files in /app:" && ls -la /app
RUN echo "Looking for .pkl files:" && find /app -name "*.pkl" -type f

# Expose the port Render expects
EXPOSE 10000

# Start the app
CMD ["uvicorn", "app:app", "--host=0.0.0.0", "--port=10000"]