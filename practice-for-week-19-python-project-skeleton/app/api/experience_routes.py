from flask import Blueprint, render_template, jsonify, request
from ..forms import ExperienceForm, ExperienceImageForm, BookingForm, ReviewForm, ReviewImageForm
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

    experience = Experience.query.get(exp_id)
    exp_user_id = experience.host_id
    
    form = ExperienceForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if experience and form.validate_on_submit():
      if (exp_user_id == current_user.id):
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
      else: 
        return "Only the host can edit an experience.", 401 

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


@experience_routes.route('/<int:exp_id>/reviews/<int:rvw_id>', methods=["GET"])
def get_one_rvw(exp_id, rvw_id):
    """Get a review by id"""

    rvw = Review.query.get(rvw_id)
    experience = Experience.query.get(exp_id)

    if not experience: 
      return "Experience does not exist", 404
    if not rvw: 
      return "Review not found", 404
        
    return jsonify(review_schema.dump(rvw))

@experience_routes.route('/<int:exp_id>/reviews/<int:rvw_id>/images', methods=["POST"])
def create_one_rvw_img(exp_id, rvw_id):
    """Add an image to a review"""

    experience = Experience.query.get(exp_id)
    review = Review.query.get(rvw_id)

    if not experience: 
      return "Experience does not exist", 404
    if not review: 
      return "Review does not exist.", 404

    form = ReviewImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']  
    if form.validate_on_submit():
      if review.user_id == current_user.id:
        data = form.data
        new_review_image = ReviewImage(
            review_id=rvw_id,
            image_url=data['image_url']
        )

        db.session.add(new_review_image)
        db.session.commit()
          
        return jsonify(review_image_schema.dump(new_review_image))
      else: 
        return "Only the review author can add an image to a review.", 401  

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401    


@experience_routes.route('/<int:exp_id>/reviews', methods=["POST"])
def create_one_rvw(exp_id):
    """Create a review"""

    experience = Experience.query.get(exp_id)
    bookings = experience.bookings

    if not experience: 
      return "Experience does not exist", 404
    if not bookings: 
      return "Nobody has booked this experience yet. ", 404

    for booking in bookings: 
      if booking.user_id == current_user.id or experience.host_id == current_user.id: 
        form = ReviewForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
          data = form.data

          new_review = Review(
            exp_id=exp_id,
            user_id=current_user.id,
            stars=data['stars'],
            review_body=data['review_body']
          )

          db.session.add(new_review)
          db.session.commit()
          
          return jsonify(review_schema.dump(new_review))
      else: 
        return "Only users who have booked this experience can leave a review.", 401  

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401    


@experience_routes.route('/<int:exp_id>/reviews', methods=["GET"])
def get_all_reviews(exp_id):
    """Get all reviews by exp_id"""

    experience = Experience.query.get(exp_id)
    reviews = Review.query.filter(Review.exp_id == exp_id).all()

    if not experience: 
      return "Experience does not exist", 404
    if not reviews: 
      return "Reviews not found", 404

    rvw_list = []
    for review in reviews: 
      rvw_list.append(review.to_dict())

    return jsonify(rvw_list)


@experience_routes.route('/<int:exp_id>/reviews/<int:rvw_id>', methods=["PUT"])
def edit_one_rvw(exp_id, rvw_id):
    """Edit a review"""

    rvw = Review.query.get(rvw_id)
    experience = Experience.query.get(exp_id)
    rvw_user_id = rvw.user_id

    if not experience: 
      return "Experience does not exist", 404
    if not rvw: 
      return "Review not found", 404
    
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
      if (current_user.id == rvw_user_id): 
        data = form.data

        exp_id=exp_id 
        stars=data['stars']
        review_body=data['review_body']

        rvw.stars=stars
        rvw.exp_id=exp_id 
        rvw.review_body=review_body 

        db.session.add(rvw)
        db.session.commit()
        
        return jsonify(review_schema.dump(rvw))
      else: 
        return "Only the review author can edit a review.", 401  

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@experience_routes.route('/<int:exp_id>/reviews/<int:rvw_id>', methods=["DELETE"])
def delete_a_rvw(exp_id, rvw_id):
    """Delete a review"""

    experience = Experience.query.get(exp_id)
    review = Review.query.get(rvw_id)

    if not experience: 
      return "Experience does not exist", 404
    if not review: 
      return "Review does not exist.", 404

    if review.user_id == current_user.id or experience.host_id == current_user.id: 
      images = review.review_images
      for img in images: 
        db.session.delete(img)
      db.session.delete(review)
      db.session.commit()
          
      return "Successfully deleted.", 200
    else: 
      return "Permission denied.", 401           


@experience_routes.route('/<int:exp_id>/reviews/<int:rvw_id>/images/<int:img_id>', methods=["DELETE"])
def delete_a_rvw_image(exp_id, rvw_id, img_id):
    """Delete a review image"""

    experience = Experience.query.get(exp_id)
    review = Review.query.get(rvw_id)

    if not experience: 
      return "Experience does not exist", 404
    if not review: 
      return "Review does not exist.", 404

    if review.user_id == current_user.id or experience.host_id == current_user.id: 
      images = review.review_images
      for img in images: 
        if (img.id == img_id):
          db.session.delete(img)
      db.session.commit()
          
      return "Image successfully deleted.", 200
    else: 
      return "Permission denied.", 401  

@experience_routes.route('/<int:exp_id>/images/<int:img_id>', methods=["DELETE"])
def delete_a_exp_image(exp_id, img_id):
    """Delete an experience image"""

    experience = Experience.query.get(exp_id)
    images = experience.images

    if not experience: 
      return "Experience does not exist", 404
    if not images: 
      return "Experience has no images", 404

    if experience.host_id == current_user.id: 
      for img in images: 
        if (img.id == img_id):
          db.session.delete(img)
          db.session.commit()
          return "Image successfully deleted.", 200
        else: 
          return "Image not found", 404
    else: 
      return "Permission denied.", 401                 
