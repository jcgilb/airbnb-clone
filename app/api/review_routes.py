from flask import Blueprint, render_template, jsonify, request
from ..forms import BookingForm, EditBookingForm
from app.models.experiences import db, Experience, ExperienceImage, experience_schema, experiences_schema, experience_image_schema, experience_images_schema
from app.models.reviews import db, Review, ReviewImage, review_schema, reviews_schema, review_image_schema, reviews_images_schema
from app.models.bookings import db, Booking, booking_schema, bookings_schema
from flask_login import login_required, current_user
from datetime import datetime
from app.models import User

review_routes = Blueprint('reviews', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@review_routes.route('/<int:rvw_id>', methods=["GET"])
def get_one_rvw(rvw_id):
    """Get one review by id"""

    one_rvw = Review.query.get(rvw_id)
    
    if not one_rvw:
        return {"message": ["booking couldn't be found."]}, 404
  
    rvw_in_dict = one_rvw.to_dict()
    return rvw_in_dict    
    




# @booking_routes.route('/<int:rvw_id>', methods=["DELETE"])
# def delete_one_rvw(rvw_id):
#   """Delete a rvw by id"""
#   rvw = Booking.query.get(rvw_id)
#   if rvw:
#     db.session.delete(rvw)
#     db.session.commit()
#     result = booking_schema.dump(rvw)
#     return "booking deleted successfully.", 200 
#   else:
#     return "booking not found.", 404    
