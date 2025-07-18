FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN echo "Files in /app:" && ls -la /app
RUN echo "Looking for .pkl files:" && find /app -name "*.pkl" -type f

EXPOSE 10000

# Make start script executable
RUN chmod +x start.sh

# Start the app
CMD ["./start.sh"]
