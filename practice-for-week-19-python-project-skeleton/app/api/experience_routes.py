from flask import Blueprint, render_template, jsonify, request
from ..forms import ExperienceForm, ExperienceImageForm, BookingForm
from app.models.experiences import db, Experience, ExperienceImage, experience_schema, experiences_schema, experience_image_schema, experience_images_schema
from app.models.bookings import db, Booking, booking_schema, bookings_schema
from app.models.reviews import db, Review, ReviewImage, review_schema, reviews_schema, review_image_schema, reviews_images_schema
from flask_login import login_required, current_user
from app.models import User

experience_routes = Blueprint('experiences', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@experience_routes.route('', methods=["GET"])
def get_experiences():
    """
    Get all experiences, include reviews, images, and bookings
    """
    experiences = Experience.query.all()

    exp_list = []
    for exp in experiences:
        exp_bookings = exp.to_dict()["bookings"]
        exp_reviews = exp.to_dict()["reviews"]
        exp_images = exp.to_dict()["images"]
        exp_in_dict = exp.to_dict()
        exp_list.append(exp_in_dict)

    return jsonify(exp_list)

@experience_routes.route('/<int:exp_id>', methods=["GET"])
def get_one_experience(exp_id):
    """Get one experience, include reviews, images, and bookings"""

    one_experience = Experience.query.get(exp_id)
    if not one_experience:
        return {"message": ["Experience couldn't be found."]}, 404
    exp_reviews = one_experience.to_dict()["reviews"]
    exp_bookings = one_experience.to_dict()["bookings"]
    exp_images = one_experience.to_dict()["images"]

    exp_in_dict = one_experience.to_dict()

    return exp_in_dict    

@experience_routes.route('', methods=["POST"])
def create_one_experience():
    """Create an experience"""

    form = ExperienceForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        new_experience = Experience(
            host_id=current_user.id,
            address=data['address'],
            city=data['city'],
            state=data['state'],
            country=data['country'],
            lat=data['lat'],
            lng=data['lng'],
            name=data['name'],
            description=data['description'],
            price=data['price']
        )

        db.session.add(new_experience)
        db.session.commit()

        success_response = Experience.query.order_by(Experience.id.desc()).first()
        return jsonify(experience_schema.dump(success_response))

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@experience_routes.route('/<int:exp_id>', methods=["PUT"])
def edit_one_experience(exp_id):
    """Edit an experience"""

    form = ExperienceForm()
    experience = Experience.query.get(exp_id)
    form['csrf_token'].data = request.cookies['csrf_token']

    if experience and form.validate_on_submit():
        data = form.data

        host_id=current_user.id
        address=data['address']
        city=data['city']
        state=data['state']
        country=data['country']
        lat=data['lat']
        lng=data['lng']
        name=data['name']
        description=data['description']
        price=data['price']

        experience.host_id=host_id
        experience.address=address
        experience.city=city
        experience.state=state
        experience.country=country
        experience.lat=lat
        experience.lng=lng
        experience.name=name
        experience.description=description
        experience.price=price

        db.session.add(experience)
        db.session.commit()

        return (jsonify(experience.to_dict()))

    return "Experience not found", 404


@experience_routes.route('/<int:exp_id>', methods=["DELETE"])
def delete_experience(exp_id):
    """Delete a exp by id"""
    exp = Experience.query.get(exp_id)
    if exp:
        bookings = Booking.query.filter_by(exp_id=exp_id).all()
        images = ExperienceImage.query.filter_by(exp_id=exp_id).all()
        reviews = Review.query.filter_by(exp_id=exp_id).all()
        for review in reviews:
          rvw_images = review.review_images
          for rvw_image in rvw_images:
              db.session.delete(image)
        for booking in bookings:
          db.session.delete(booking)
        for image in images:
          db.session.delete(image)
        db.session.delete(exp)
        db.session.commit()
        result = experience_schema.dump(exp)
        return "experience deleted successfully.", 200 
    else:
        return "experience not found.", 404    


@experience_routes.route('/<int:exp_id>/bookings', methods=["POST"])
def create_one_bkg(exp_id):
    """Create a booking"""

    form = BookingForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        data = form.data
        new_booking = Booking(
            exp_id=exp_id,
            user_id=data['user_id'],
            start_date=data['start_date']
        )

        db.session.add(new_booking)
        db.session.commit()

        success_response = Booking.query.order_by(Booking.id.desc()).first()
        return jsonify(booking_schema.dump(success_response))

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401



