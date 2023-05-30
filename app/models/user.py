from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import func

follows = db.Table(
    "follows", 
    db.Column("follower_id", db.Integer, db.ForeignKey("users.id")),
    db.Column("followed_id", db.Integer, db.ForeignKey("users.id"))
)

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(40), nullable=False)
    last_name = db.Column(db.String(40), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    profile_url = db.Column(db.Text)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    followers = db.relationship(
        "User", 
        secondary=follows,
        primaryjoin=(follows.c.follower_id == id),
        secondaryjoin=(follows.c.followed_id == id),
        backref=db.backref("following", lazy="dynamic"),
        lazy="dynamic"
    )
    
    # One to many with pins
    pins = db.relationship("Pin", back_populates="user", cascade="all, delete-orphan")

    # One to many with profiles
    profiles = db.relationship("Profile", back_populates="user", cascade="all, delete-orphan")

    # One to many with saved_pins
    saved_pins = db.relationship("SavedPin", back_populates="user", cascade="all, delete-orphan")

    # One to many with comments
    comments = db.relationship("Comment", back_populates="user", cascade="all, delete-orphan")

    # One to many with pin_images
    pin_images = db.relationship("PinImage", back_populates="user", cascade="all, delete-orphan")


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    # user should be the user you are going to follow
    def follow(self, user):
        # check if you are already following the user
        if user.id not in self.following:
            self.following.append(user)


    # user should be the user you are going to unfollow
    def unfollow(self, user): 
        # check if the user is in your followers list
        if user.id in self.following:
            self.following.remove(user)
        

    def to_dict(self):
        return {
            'id': self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            'username': self.username,
            'email': self.email,
            "profile_url": self.profile_url,
        }
