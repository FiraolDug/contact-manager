# Contact Manager

A full-stack contact management application built with Flask backend and React frontend, featuring user authentication, CRUD operations, search, and filtering capabilities.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Contact Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Search & Filtering**: Real-time search across name, email, and phone
- **Sorting**: Sort contacts by name, email, or phone (ascending/descending)
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: Clean, modern interface using Material UI
- **SQLite Database**: Lightweight, file-based database
- **REST API**: Complete RESTful API with proper error handling

## 🛠 Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLite**: Database
- **JWT**: Authentication tokens
- **Flask-CORS**: Cross-origin resource sharing
- **Werkzeug**: Password hashing

### Frontend
- **React**: JavaScript library for building user interfaces
- **Material UI**: React component library
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.7 or higher)
- **npm** (comes with Node.js)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

#### Windows
```bash
# Run the setup script
setup.bat
```

#### Unix/Linux/Mac
```bash
# Make the script executable and run it
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Install root dependencies**
   ```bash
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Unix/Linux/Mac
   source venv/bin/activate
   
   pip install -r requirements.txt
   cd ..
   ```

## 🏃‍♂️ Running the Application

### Start Both Backend and Frontend Concurrently
```bash
npm start
```

### Run Individually

#### Backend Only
```bash
npm run backend
```

#### Frontend Only
```bash
npm run frontend
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
contact-manager/
├── backend/
│   ├── app.py              # Flask application
│   ├── run.py              # Backend runner script
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API service
│   │   └── ...
│   ├── package.json        # Frontend dependencies
│   └── ...
├── package.json            # Root package.json
├── setup.bat              # Windows setup script
├── setup.sh               # Unix/Linux setup script
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login

### Contacts
- `GET /contacts` - Get all contacts for authenticated user
- `GET /contacts/search` - Search contacts with filters
- `GET /contacts/:id` - Get specific contact
- `POST /contacts` - Create new contact
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact

## 🎯 Usage

1. **Register/Login**: Create an account or log in with existing credentials
2. **Add Contacts**: Click "Add Contact" to create new contacts
3. **Search**: Use the search bar to filter contacts by name, email, or phone
4. **Sort**: Use the dropdown to sort contacts by different fields
5. **Edit/Delete**: Use the action buttons to modify or remove contacts

## 🔒 Security Features

- Password hashing using Werkzeug
- JWT token-based authentication
- Protected routes requiring authentication
- Input validation and sanitization
- SQL injection prevention

## 🎨 UI Features

- **Material Design**: Modern, clean interface
- **Responsive Layout**: Works on all screen sizes
- **Search & Filter**: Real-time filtering and sorting
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages
- **Hover Effects**: Interactive table rows

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Kill processes using ports 3000 or 5000
   - Or change ports in the respective configuration files

2. **Python dependencies not found**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`

3. **Node modules not found**
   - Run `npm install` in the frontend directory

4. **Database issues**
   - Delete `contact_manager.db` to reset the database
   - Restart the backend server

### Development Tips

- Backend runs in debug mode for development
- Frontend has hot reload enabled
- Check browser console for frontend errors
- Check terminal for backend errors

