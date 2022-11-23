from .db import db, ma, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import func

class Experience(db.Model):
    __tablename__ = 'experiences'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    host_id = db.Column(db.Integer(), db.ForeignKey(add_prefix_for_prod(
        'users.id')), nullable=False)
    address = db.Column(db.String(), nullable=False)
    city = db.Column(db.String(), nullable=False)
    state = db.Column(db.String(), nullable=False)
    country = db.Column(db.String(), nullable=False)
    lat = db.Column(db.Float(), nullable=False)
    lng = db.Column(db.Float(), nullable=False)
    name = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=False)
    price = db.Column(db.Float(), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    bookings = db.relationship("Booking", back_populates="exp_booking")
    reviews = db.relationship("Review", back_populates="exp_review")
    images = db.relationship("ExperienceImage", back_populates="exp_image")
    exp_host = db.relationship("User", back_populates="host_exps")

    # bookings = db.relationship("Booking", backref="booking")
    # reviews = db.relationship("Review", backref="review")
    # images = db.relationship("ExperienceImage", backref="experience_image")

    def to_dict(self):
        return {
            'id': self.id,
            'host_id': self.host_id,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'lat': self.lat,
            'lng': self.lng,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'bookings': [self.booking.to_dict() for self.booking in self.bookings],
            'reviews': [self.review.to_dict() for self.review in self.reviews],
            'images': [self.image.to_dict() for self.image in self.images],
            'exp_host': [self.host.to_dict() for self.host in self.exp_host],
        }


class ExperienceImage(db.Model):
    __tablename__ = 'experience_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exp_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('experiences.id')), nullable=False)
    image_url = db.Column(db.String(), nullable=False)
    preview = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    exp_image = db.relationship("Experience", back_populates="images")

    def to_dict(self):
        return {
            'id': self.id,
            'exp_id': self.exp_id,
            'image_url': self.image_url,
            'preview': self.preview,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at)
        }

class ExperienceSchema(ma.Schema):
    class Meta:
        fields = ("id", "exp_id", "image_url, preview, created_at, updated_at")

class ExperienceImageSchema(ma.Schema):
    class Meta:
        fields = ("id", "exp_id", "image_url, preview, created_at, updated_at")

experience_schema = ExperienceSchema()
experiences_schema = ExperienceSchema(many=True)

experience_image_schema = ExperienceImageSchema()
experience_images_schema = ExperienceImageSchema(many=True)
