from ..models import User, environment, SCHEMA
from ..models.bookings import Booking, db
from sqlalchemy import func


def seed_bookings():
    booking1 = Booking(
        user_id=6,
        exp_id=1,
        time_slot_id=1,
        # end_date=func.now(),
        
    )
    booking2 = Booking(
        user_id=7,
        exp_id=2,
        time_slot_id=2,
        # end_date=func.now(),
        
    )
    booking3 = Booking(
        user_id=8,
        exp_id=3,
        time_slot_id=3,
        # end_date=func.now(),
        
    )
    booking4 = Booking(
        user_id=8,
        exp_id=4,
        time_slot_id=4,
        # end_date=func.now(),
        
    )
    booking5 = Booking(
        user_id=10,
        exp_id=5,
        time_slot_id=5, 
        # end_date=func.now()
        
    )

    db.session.add(booking1)
    db.session.add(booking2)
    db.session.add(booking3)
    db.session.add(booking4)
    db.session.add(booking5)
    db.session.commit()

def undo_bookings():
#   if environment == "production":
#       db.session.execute(
#           f"TRUNCATE table {SCHEMA}.bookings RESTART IDENTITY CASCADE;")
#   else:
    db.session.execute("DELETE FROM bookings")

    db.session.commit()