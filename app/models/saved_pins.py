from .db import db, environment, SCHEMA
from sqlalchemy import func

class SavedPin(db.Model):
    __tablename__ = "saved_pins"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    profile_id = db.Column(db.Integer, db.ForeignKey("profiles.id"))
    pin_id = db.Column(db.Integer, db.ForeignKey("pins.id"))
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    # Many to one with users
    user = db.relationship("User", back_populates="saved_pins")

    # Many to one with profiles
    profile = db.relationship("Profile", back_populates="saved_pins")

    # One to one with pins
    pin = db.relationship("Pin", back_populates="saved_pin")