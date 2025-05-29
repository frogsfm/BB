from app import db
from datetime import datetime

class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    emotion = db.Column(db.String(20), nullable=False)
    emoji = db.Column(db.String(10), nullable=False)
    message_text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Message {self.id}: {self.emotion}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'emotion': self.emotion,
            'emoji': self.emoji,
            'message_text': self.message_text,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }