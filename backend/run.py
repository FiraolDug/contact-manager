#!/usr/bin/env python3
"""
Run script for the Contact Manager Flask backend
This script ensures the virtual environment is activated and runs the Flask app
"""

import os
import sys
import subprocess

def main():
    # Check if we're in a virtual environment
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("Warning: Not running in a virtual environment!")
        print("Please activate the virtual environment first:")
        print("  Windows: backend\\venv\\Scripts\\activate")
        print("  Unix/Mac: source backend/venv/bin/activate")
        print()
    
    # Import and run the Flask app
    try:
        from app import app
        print("Starting Flask backend server...")
        print("Backend will be available at: http://localhost:5000")
        print("Press Ctrl+C to stop the server")
        print("-" * 50)
        
        app.run(debug=True, host='0.0.0.0', port=5000)
        
    except ImportError as e:
        print(f"Error importing Flask app: {e}")
        print("Make sure all dependencies are installed:")
        print("  pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"Error running Flask app: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main() 