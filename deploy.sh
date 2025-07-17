#!/bin/bash
# Simple deployment script for Anonymous Chat Application

echo "Setting up Anonymous Chat Application..."

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create database
echo "Setting up database..."
python3 -c "from app import db_manager; print('Database initialized successfully')"

# Run the application
echo "Starting application..."
echo "Open your browser and go to http://localhost:5000"
python3 run.py
