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
    est_duration = db.Column(db.Integer(), nullable=False)
    city = db.Column(db.String(), nullable=False)
    state = db.Column(db.String(), nullable=False)
    country = db.Column(db.String(), nullable=False)
    lat = db.Column(db.Float())
    lng = db.Column(db.Float())
    name = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=False)
    price = db.Column(db.Float(), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    bookings = db.relationship("Booking", back_populates="exp_booking")
    reviews = db.relationship("Review", back_populates="exp_review")
    images = db.relationship("ExperienceImage", back_populates="exp_image")
    exp_host = db.relationship("User", back_populates="host_exps")
    time_slots = db.relationship("TimeSlot", back_populates="experience")

    # bookings = db.relationship("Booking", backref="booking")
    # reviews = db.relationship("Review", backref="review")
    # images = db.relationship("ExperienceImage", backref="experience_image")

    def to_dict(self):
        return {
            'id': self.id,
            'host_id': self.host_id,
            'est_duration': self.est_duration,
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
            'exp_host': self.exp_host.to_dict(),
            'bookings': [self.booking.to_dict() for self.booking in self.bookings],
            'reviews': [self.review.to_dict() for self.review in self.reviews],
            'images': [self.image.to_dict() for self.image in self.images],
            'time_slots': [slot.to_dict() for slot in self.time_slots],
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

class TimeSlot(db.Model):
    __tablename__ = 'time_slots'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exp_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('experiences.id')), nullable=False)
    start = db.Column(db.String())
    end = db.Column(db.String())
    # start_date = db.Column(db.String())
    # end_date = db.Column(db.String())

    bookings = db.relationship("Booking", back_populates="time_slot")
    experience = db.relationship("Experience", back_populates="time_slots")

    def to_dict(self):
        return {
            'id': self.id,
            'exp_id': self.exp_id,
            'start': self.start,
            'end': self.end,
            # 'start_date': self.start_date,
            # 'end_date': self.end_date
        }


class ExperienceSchema(ma.Schema):
    class Meta:
        fields = ("id", "host_id", "est_duration", "total_exp", "address", "city","lat", "lng", "name", "description", "price", "created_at", "updated_at")

class ExperienceImageSchema(ma.Schema):
    class Meta:
        fields = ("id", "exp_id", "image_url", "preview", "created_at", "updated_at")

class TimeSlotSchema(ma.Schema):
    class Meta:
        fields = ("id", "exp_id", "start", "end")        

experience_schema = ExperienceSchema()
experiences_schema = ExperienceSchema(many=True)

experience_image_schema = ExperienceImageSchema()
experience_images_schema = ExperienceImageSchema(many=True)

time_slot_schema = TimeSlotSchema()
time_slots_schema = TimeSlotSchema(many=True)
