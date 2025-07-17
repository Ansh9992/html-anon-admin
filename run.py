
#!/usr/bin/env python3
"""
Simple run script for the Anonymous Chat Application
"""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == '__main__':
    from app import app, socketio
    print("Starting Anonymous Chat Application...")
    print("Open your browser and go to http://localhost:5000")
    print("Press Ctrl+C to stop the server")

    try:
        socketio.run(app, debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\nShutting down server...")
        sys.exit(0)
