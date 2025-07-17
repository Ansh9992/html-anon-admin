
# Anonymous Chat Application

A real-time anonymous chat application built with Flask, Flask-SocketIO, and vanilla JavaScript.

## Features

- **Anonymous Chatting**: No registration required, temporary usernames
- **Gender-based Matching**: Choose to chat with males, females, or anyone
- **Real-time Messaging**: WebSocket-based instant messaging
- **User Profiles**: Optional bio and custom username
- **Secure**: No permanent data storage, privacy-focused design
- **Responsive**: Works on desktop and mobile devices

## Requirements

- Python 3.7+
- Flask
- Flask-SocketIO
- SQLite (comes with Python)

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:
   ```bash
   python app.py
   ```

4. Open your browser and go to `http://localhost:5000`

## Database Schema

The application uses SQLite with the following tables:

- **users**: Stores temporary user sessions
- **chat_rooms**: Manages chat room connections
- **messages**: Stores chat messages (temporary)

## Security Features

- Session-based authentication
- No permanent user data storage
- Anonymous usernames
- Gender-based matching for safety
- Real-time connection management

## Usage

1. Visit the homepage
2. Enter optional username and bio
3. Select your gender and preference
4. Click "Start Anonymous Chat"
5. Wait for a match
6. Start chatting!

## API Endpoints

- `GET /`: Homepage
- `GET /chat`: Chat interface
- `POST /join`: Join chat with user details

## WebSocket Events

- `connect`: User connects to server
- `find_match`: Request to find a chat partner
- `send_message`: Send message to chat partner
- `leave_chat`: Leave current chat
- `disconnect`: User disconnects

## Deployment

For production deployment:

1. Use a production WSGI server like Gunicorn
2. Configure proper secret keys
3. Set up SSL/HTTPS
4. Consider Redis for session storage
5. Add rate limiting and abuse prevention

## License

This project is open source and available under the MIT License.
