@echo off
echo Setting up Contact Manager Development Environment...
echo.

echo Installing root dependencies...
npm install

echo.
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo Setting up Python virtual environment...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo.
echo Setup complete! 
echo.
echo To start the application, run:
echo   npm start
echo.
echo Or run individually:
echo   npm run backend  (for Flask backend only)
echo   npm run frontend (for React frontend only)
echo.
pause 