from flask import Flask,jsonify,request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)


DATABASE_NAME = 'contact_manager.db'


def get_database_connection():
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection

def create_database():
    connection = get_database_connection()
    cursor = connection.cursor()
    cursor.execute(
        '''
CREATE TABLE IF NOT EXISTS contact(
id INTEGER PRIMARY KEY AUTOINCREMENT,
contact_name TEXT NOT NULL,
contact_email TEXT UNIQUE NOT NULL,
contact_phone TEXT NOT NULL
)
'''
    )
    connection.commit()
    connection.close()

create_database()

@app.route('/contacts',methods=['GET'])
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