from .db import db
from sqlalchemy import func

class PinImage(db.Model):
    __tablename__ = "pin_images"

    id = db.Column(db.Integer, primary_key=True)
    pin_id = db.Column(db.Integer, db.ForeignKey("pins.id"))
    image_url = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    # Many to one with pins
    pin = db.relationship("Pin", back_populates="pin_images")
