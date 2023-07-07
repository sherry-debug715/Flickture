from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import func

class Category(db.Model):
    __tablename__ = "categories"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    pin_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("pins.id")))
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