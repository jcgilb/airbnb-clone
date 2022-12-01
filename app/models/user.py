from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    # if environment == "production":
    #     __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    total_exp = db.Column(db.String(40), nullable=False, default=int(0))
    username = db.Column(db.String(40), nullable=False, unique=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255))
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    
    # review = db.relationship("Review", back_populates="review_author")
    bookings = db.relationship("Booking", back_populates="user_booking")
    host_exps = db.relationship("Experience", back_populates="exp_host")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'total_exp': self.total_exp,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'image_url': self.image_url
        }
