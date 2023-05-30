from .db import db
from sqlalchemy import func
from .profiles import pins_profiles

class Pin(db.Model):
    __tablename__ = "pins"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    # Many to one with users
    user = db.relationship("User", back_populates="pins")

    # Many to Many with profiles
    profiles = db.relationship("Profile", back_populates="pins", secondary=pins_profiles)

    # One to many with pin_images
    pin_images = db.relationship("PinImage", back_populates="pin", cascade="all, delete-orphan")

    # One to one with saved_pins
    saved_pin = db.relationship("SavedPin", uselist=False, back_populates="pin")

    # One to many with comments
    comments = db.relationship("Comment", back_populates="pin", cascade="all, delete-orphan")

    # One to many with categories
    categories = db.relationship("Category", back_populates="pin")

    def get_all_pins(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "creator": self.user.to_dict(),
            "pin_in_profiles": [profile.to_dict() for profile in self.profiles],
            "pin_images": [image.to_dict() for image in self.pin_images],
            "pin_comments": [comment.to_dict() for comment in self.comments]
        }