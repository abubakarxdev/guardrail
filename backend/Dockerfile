FROM python:3.10-slim

WORKDIR /code

# Copy requirements and install
COPY requirements.txt .
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Expose port and run uvicorn by default
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
