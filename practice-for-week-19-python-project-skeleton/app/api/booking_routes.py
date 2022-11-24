from flask import Blueprint, render_template, jsonify, request
from ..forms import BookingForm, EditBookingForm
from app.models.experiences import db, Experience, ExperienceImage, experience_schema, experiences_schema, experience_image_schema, experience_images_schema
from app.models.reviews import db, Review, ReviewImage, review_schema, reviews_schema, review_image_schema, reviews_images_schema
from app.models.bookings import db, Booking, booking_schema, bookings_schema
from flask_login import login_required, current_user
from datetime import datetime
from app.models import User

booking_routes = Blueprint('bookings', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@booking_routes.route('/<int:bkg_id>', methods=["GET"])
def get_one_bkg(bkg_id):
    """Get one booking by id"""

    one_bkg = Booking.query.get(bkg_id)
    
    if not one_bkg:
        return {"message": ["booking couldn't be found."]}, 404
  
    bkg_in_dict = one_bkg.to_dict()
    return bkg_in_dict    
    

@booking_routes.route('/<int:bkg_id>', methods=["PUT"])
def edit_one_bkg(bkg_id):
    """Edit a booking"""

    form = EditBookingForm()
    bkg = Booking.query.get(bkg_id)
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data

        start_date=data['start_date']
        bkg.start_date=start_date

        db.session.add(bkg)
        db.session.commit()
        
        return jsonify(booking_schema.dump(bkg))

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@booking_routes.route('/<int:bkg_id>', methods=["DELETE"])
def delete_one_bkg(bkg_id):
  """Delete a bkg by id"""
  bkg = Booking.query.get(bkg_id)
  if bkg:
    db.session.delete(bkg)
    db.session.commit()
    result = booking_schema.dump(bkg)
    return "booking deleted successfully.", 200 
  else:
    return "booking not found.", 404    
