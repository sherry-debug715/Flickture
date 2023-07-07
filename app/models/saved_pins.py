from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import func

class SavedPin(db.Model):
    __tablename__ = "saved_pins"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    profile_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("profiles.id")))
    pin_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pins.id")))
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    # Many to one with users
    user = db.relationship("User", back_populates="saved_pins")

    # Many to one with profiles
    profile = db.relationship("Profile", back_populates="saved_pins")

    # One to one with pins
    pin = db.relationship("Pin", back_populates="saved_pin")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'profile_id': self.profile_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'pin': self.pin.pin_to_save() if self.pin else None,
        }