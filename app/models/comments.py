from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import func

class Comment(db.Model):
    __tablename__ = "comments"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    pin_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pins.id")))
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    # Many to one with users
    user = db.relationship("User", back_populates="comments")
    
    # Many to one with pins
    pin = db.relationship("Pin", back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "pin_id": self.pin_id,
            "content": self.content,
            "creator": self.user.basic(),
            "created_at": self.created_at
        }