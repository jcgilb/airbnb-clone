from sqlalchemy import func
from sqlalchemy.orm import validates
from .db import db, ma, environment, SCHEMA, add_prefix_for_prod

class Booking(db.Model):
    __tablename__ = "bookings"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    exp_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("experiences.id")), nullable=False)
    time_slot_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("time_slots.id")), unique=True)
    created_at = db.Column(db.DateTime(timezone=True),server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    user_booking = db.relationship("User", back_populates="bookings")
    exp_booking = db.relationship("Experience", back_populates="bookings") 
    time_slot = db.relationship("TimeSlot", back_populates="bookings")   

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'exp_id': self.exp_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at, 
            'time_slot_id': self.time_slot_id, 
            'user_booking': self.user_booking.to_dict(),
            # 'time_slot': self.time_slot.to_dict(),
        }

class BookingSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "user_id",
            "exp_id",
            "created_at", 
            "updated_at",
            'time_slot_id'
            )


booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)

# from sqlalchemy import func
# from sqlalchemy.orm import validates
# from .db import db, ma, environment, SCHEMA, add_prefix_for_prod

# class Booking(db.Model):
#     __tablename__ = "bookings"

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey(
#         add_prefix_for_prod("users.id")), nullable=False)
#     exp_id = db.Column(db.Integer, db.ForeignKey(
#         add_prefix_for_prod("experiences.id")), nullable=False, index=True)
#     start_date = db.Column(db.String(), index=True)
#     # end_date = db.Column(db.DateTime(timezone=True), unique=True)
#     created_at = db.Column(db.DateTime(timezone=True),server_default=func.now())
#     updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

#     user_booking = db.relationship("User", back_populates="bookings")
#     exp_booking = db.relationship("Experience", back_populates="bookings")

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'user_id': self.user_id,
#             'exp_id': self.exp_id,
#             'start_date': self.start_date,
#             'created_at': self.created_at,
#             'updated_at': self.updated_at, 
#             'user_booking': self.user_booking.to_dict(), 
#             # 'end_date': self.end_date,
#             # 'exp_booking': self.exp_booking.to_dict(),
#         }

# class BookingSchema(ma.Schema):
#     class Meta:
#         fields = (
#             "id",
#             "user_id",
#             "exp_id",
#             "start_date", 
#             # "end_date", 
#             "created_at", 
#             "updated_at")


# booking_schema = BookingSchema()
# bookings_schema = BookingSchema(many=True)

