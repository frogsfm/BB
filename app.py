import os
import logging
from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix

# Set up logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize database
db.init_app(app)

with app.app_context():
    # Import models to create tables
    import models
    db.create_all()

@app.route('/')
def index():
    """Serve the main emotional messenger page"""
    return render_template('index.html')

@app.route('/save-message', methods=['POST'])
def save_message():
    """Save a message to the database"""
    try:
        data = request.get_json()
        
        # Create new message
        message = models.Message(
            emotion=data.get('emotion'),
            emoji=data.get('emoji'),
            message_text=data.get('message', '')
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Message saved successfully!',
            'data': message.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error saving message: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to save message'
        }), 500

@app.route('/messages')
def get_messages():
    """Get all messages from the database"""
    try:
        messages = models.Message.query.order_by(models.Message.created_at.desc()).all()
        return jsonify({
            'success': True,
            'messages': [msg.to_dict() for msg in messages]
        })
    except Exception as e:
        app.logger.error(f"Error fetching messages: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to fetch messages'
        }), 500

@app.route('/admin')
def admin_panel():
    """Admin panel to view all messages"""
    return render_template('admin.html')

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return {'status': 'healthy'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
