
# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860 \
    FLASK_ENV=production

# Set work directory
WORKDIR /app

# Install system dependencies (e.g., for Graphviz if needed by swarms/agents)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    graphviz \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Create a non-root user and switch to it (Hugging Face Best Practice)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Expose the port (Hugging Face Spaces expects 7860)
EXPOSE 7860

# Initialize database and run the application
CMD python init_db.py && gunicorn --bind 0.0.0.0:7860 --workers 2 --threads 4 run_api:app
