
"""
Configuration file for Anonymous Chat Application
"""
import os
import uuid

class Config:
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-' + str(uuid.uuid4())

    # Database
    DATABASE_PATH = os.environ.get('DATABASE_PATH') or 'chat.db'

    # Chat settings
    MAX_MESSAGE_LENGTH = 1000
    MAX_BIO_LENGTH = 200
    MAX_USERNAME_LENGTH = 50

    # Session settings
    SESSION_TIMEOUT = 3600  # 1 hour

    # Rate limiting
    MAX_MESSAGES_PER_MINUTE = 30
    MAX_CONNECTIONS_PER_IP = 5

    # Development settings
    DEBUG = os.environ.get('DEBUG') == 'True'

    # Server settings
    HOST = os.environ.get('HOST') or '0.0.0.0'
    PORT = int(os.environ.get('PORT') or 5000)

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

    # Production security settings
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
