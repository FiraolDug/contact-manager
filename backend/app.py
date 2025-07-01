from flask import Flask,jsonify,request
from flask_cors import CORS
import sqlite3
import jwt
import datetime
from werkzeug.security import generate_password_hash,check_password_hash
from functools import wraps

app = Flask(__name__)
CORS(app)


app.config['SECRECT_KEY'] = 'secret_key'
app.config['DATABASE_NAME'] = 'contact_manager.db'
app.config['TOKEN_EXPERTION_TIME'] = 7200

def get_database_connection():
    connection = sqlite3.connect(app.config['DATABASE_NAME'])
    connection.row_factory = sqlite3.Row
    return connection

def create_database():
    connection = get_database_connection()
    cursor = connection.cursor()

    cursor.execute(
    '''
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    '''
)

    cursor.execute(
        '''
CREATE TABLE IF NOT EXISTS contact(
id INTEGER PRIMARY KEY AUTOINCREMENT,
contact_name TEXT NOT NULL,
contact_email TEXT UNIQUE NOT NULL,
contact_phone TEXT NOT NULL,
user_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id),
UNIQUE (contact_email,user_id)
)
'''
    )
    connection.commit()
    connection.close()

create_database()


def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token= None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing'}),401
        
        try:
            data = jwt.decode(token , app.config['SECRECT_KEY'],algorithms=['HS256'])
            current_user = get_user_by_id(data['user_id'])
        except:
            return jsonify({'message':'Token is invalid!'})
        
        return f(current_user,*args,**kwargs)
    
    return decorated



def get_user_by_id(user_id):
    connection = get_database_connection()
    user = connection.execute('SELECT id , username, email FROM users WHERE id = ?',(user_id)).fetchone()
    connection.close()
    return dict(user) if user else None

@app.route('/register',methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'username , email and password are required'}),400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')  

    connection = get_database_connection()

    try:
        cursor = connection.cursor()
        cursor.execute(
            'INSERT INTO users (username,email,password) VALUES (?,?,?)',((username,email,hashed_password))
        )
        connection.commit()
        user_id = cursor.lastrowid
    except sqlite3.IntegrityError as e:
        connection.close()
        if 'username' in str(e):
            return jsonify({'message':'Username already exists!'}),400
        elif 'email' in str(e):
            return jsonify({'message':'Email already exists!'}),400
        return jsonify({'message':'Registration Failed!'}),400
    connection.close()

    token = jwt.encode({
        'user_id':user_id,
        'exp':datetime.datetime.utcnow()+datetime.timedelta(seconds=app.config['TOKEN_EXPERTION_TIME'] )
    },app.config['SECRECT_KEY'] )


    return jsonify({
        'message':'user registered successfully',
        'token':token,
        'user':{
            'id':user_id,
            'username':username,
            'email':email
        }
    }),201


@app.route('/login',methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}),400
    
    connection = get_database_connection()
    user = connection.execute(' SELECT * FROM users WHERE email = ?',(email,)).fetchone()
    connection.close()

    if not user:
        return jsonify({
            'message':'user not found'
        }),404
    
    if check_password_hash(user['password'],password):
        token = jwt.encode({
        'user_id':user['id'],
        'exp':datetime.datetime.utcnow()+datetime.timedelta(seconds=app.config['TOKEN_EXPERTION_TIME'] )
    },app.config['SECRECT_KEY'] )
        

        return jsonify({
        'message':'Logged in successfully',
        'token':token,
        'user':{
            'id':user['id'],
            'username':user['username'],
            'email':user['email']
        }
    })

    return jsonify({'message':'invalid credentials'})
    
@app.route('/contacts',methods=['GET'])
@token_required
def get_contacts():
    connection = get_database_connection()
    contacts = connection.execute('SELECT * FROM contact').fetchall()
    connection.close()
    return jsonify([dict(contact) for contact in contacts])

@app.route('/contacts/<int:id>',methods=['GET'])
def get_contact(id):
    connection = get_database_connection()
    contact = connection.execute('SELECT * FROM contact WHERE id= ?',(id,)).fetchone()
    connection.close()
    if contact is None:
        return jsonify({'error': 'Contact not found'}), 404
    return jsonify(dict(contact))


@app.route('/contacts', methods=['POST'])
def create_contact():
    data = request.get_json()
    contact_name = data.get('contact_name')
    contact_email = data.get('contact_email')
    contact_phone = data.get('contact_phone', '')

    if not contact_name or not contact_email:
        return jsonify({"error": "Name and email are required"}), 400

    connection = get_database_connection()
    try:
        connection.execute(
            'INSERT INTO contact (contact_name, contact_email, contact_phone) VALUES (?, ?, ?)',
            (contact_name, contact_email, contact_phone)
        )
        connection.commit()
    except sqlite3.IntegrityError:
        connection.close()
        return jsonify({"error": "Email already exists"}), 400

    connection.close()
    return jsonify({"message": "Contact created"}), 201


@app.route('/contacts/<int:id>',methods=['DELETE'])
def delete_contact(id):
    connection = get_database_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM contact WHERE id = ?', (id,))
    if cursor.fetchone() is None:
        connection.close()
        return jsonify({'error': 'Contact not found'}), 404
    cursor.execute('DELETE FROM contact WHERE id = ?', (id,))
    connection.commit()
    connection.close()
    return jsonify({'message': 'Contact deleted successfully'}), 200


@app.route('/contacts/<int:id>',methods=['PUT'])
def update_contact(id):
    data = request.get_json()
    contact_name = data.get('contact_name')
    contact_email = data.get('contact_email')
    contact_phone = data.get('contact_phone', '')

    if not contact_name or not contact_email:
        return jsonify({
            "error": "Name and email are required"
        }), 400
    connection = get_database_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM contact WHERE id = ?', (id,))
    if cursor.fetchone() is None:
        connection.close()
        return jsonify({'error': 'Contact not found'}), 404
    
    try:
        cursor.execute(
            'UPDATE contact SET contact_name = ?, contact_email = ?, contact_phone = ? WHERE id = ?',
            (contact_name, contact_email, contact_phone, id)
        )
        connection.commit()
    except sqlite3.IntegrityError:
        connection.close()
        return jsonify({'error': 'Email already exists'}), 400  
    connection.close()
    return jsonify({'message': 'Contact updated successfully'}), 200

@app.route('/')
def home():
    return jsonify({"message": "Hello from the backend!"})

if __name__ == '__main__':
    app.run(debug=True)