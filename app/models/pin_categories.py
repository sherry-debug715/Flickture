from .db import db
from sqlalchemy import func

class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    pin_id = db.Column(db.Integer, db.ForeignKey("pins.id"))
    name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    # Many to one with pins
    pin = db.relationship("Pin", back_populates="categories")


    def to_dict(self):
        return {
            "id": self.id,
            "pin_id": self.pin_id,
            "name": self.name
        }