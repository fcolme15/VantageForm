FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app
COPY . .

# Expose the port Render expects
EXPOSE 10000

# Start the app
CMD ["uvicorn", "app:app", "--host=0.0.0.0", "--port=10000"]
