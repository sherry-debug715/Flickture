from .db import db, environment, SCHEMA
from sqlalchemy import func

pins_profiles = db.Table(
    "pins_profiles",

    db.Column(
        "pin_id",
        db.Integer,
        db.ForeignKey("pins.id"),
        primary_key=True
    ),

    db.Column(
        "profile_id",
        db.Integer,
        db.ForeignKey("profiles.id"),
        primary_key=True
    )
)

class Profile(db.Model):
    __tablename__ = "profiles"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    name = db.Column(db.String(50), nullable=False)
    private = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    #Many to one with users
    user = db.relationship("User", back_populates="profiles")

    #Many to Many with pins
    pins = db.relationship("Pin", back_populates="profiles", secondary=pins_profiles)

    #One to many with saved_pins
    saved_pins = db.relationship("SavedPin", back_populates="profile")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "private": self.private,
            "pins": [pin.board_pins() for pin in self.pins]
        }