from .db import db, environment, SCHEMA
from sqlalchemy import func

class PinImage(db.Model):
    __tablename__ = "pin_images"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    pin_id = db.Column(db.Integer, db.ForeignKey("pins.id"))
    image_url = db.Column(db.Text, nullable=False)
    preview = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    # Many to one with pins
    pin = db.relationship("Pin", back_populates="pin_images")

    # Many to one with users
    user = db.relationship("User", back_populates="pin_images")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "pin_id": self.pin_id,
            "image_url": self.image_url,
            "preview": self.preview
        }
