
from flask import Flask, render_template, request, jsonify, session, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room
import sqlite3
import uuid
import random
from datetime import datetime, timedelta
import os
import threading
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-' + str(uuid.uuid4())
socketio = SocketIO(app, cors_allowed_origins="*")

# Global variables to store active users and their preferences
active_users = {}
waiting_users = {}
user_rooms = {}

class DatabaseManager:
    def __init__(self, db_path='chat.db'):
        self.db_path = db_path
        self.lock = threading.Lock()

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    def add_user(self, session_id, username, bio, gender, looking_for):
        with self.lock:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO users (session_id, username, bio, gender, looking_for)
                VALUES (?, ?, ?, ?, ?)
            """, (session_id, username, bio, gender, looking_for))
            conn.commit()
            conn.close()

    def get_user(self, session_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE session_id = ?', (session_id,))
        result = cursor.fetchone()
        conn.close()
        return result

    def create_room(self, room_id, user1_session_id, user2_session_id=None):
        with self.lock:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO chat_rooms (room_id, user1_session_id, user2_session_id)
                VALUES (?, ?, ?)
            """, (room_id, user1_session_id, user2_session_id))
            conn.commit()
            conn.close()

    def save_message(self, room_id, session_id, username, message):
        with self.lock:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO messages (room_id, session_id, username, message)
                VALUES (?, ?, ?, ?)
            """, (room_id, session_id, username, message))
            conn.commit()
            conn.close()

    def get_messages(self, room_id, limit=50):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT username, message, created_at FROM messages 
            WHERE room_id = ? 
            ORDER BY created_at DESC LIMIT ?
        """, (room_id, limit))
        results = cursor.fetchall()
        conn.close()
        return list(reversed(results))

    def update_user_activity(self, session_id, is_active=True):
        with self.lock:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE users SET is_active = ? WHERE session_id = ?
            """, (is_active, session_id))
            conn.commit()
            conn.close()

db_manager = DatabaseManager()
