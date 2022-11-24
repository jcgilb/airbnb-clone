from flask import Blueprint, jsonify
from flask_login import login_required
from app.models import User
from flask_login import login_required, current_user

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/<int:id>/experiences', methods=["GET"])
def get_host_experiences(id):
    """
    Get all logged in host's experiences, include reviews, images, and bookings
    """
    user = User.query.get(current_user.id)
    if not user:
        return {"message": ["User couldn't be found."]}, 404
    exps = user.host_exps
    exp_list = []
    for exp in exps:
        exp_reviews = exp.to_dict()["reviews"]
        exp_bookings = exp.to_dict()["bookings"]
        exp_reviews = exp.to_dict()["reviews"]
        exp_images = exp.to_dict()["images"]
        exp_in_dict = exp.to_dict()
        exp_list.append(exp_in_dict)

    return jsonify(exp_list)    


@user_routes.route('/<int:id>/bookings', methods=["GET"])
def get_user_bookings(id):
    """
    Get all bookings by user id
    """
    user = User.query.get(id)
    if not user:
        return {"message": ["User couldn't be found."]}, 404
    bookings = user.bookings
    booking_list = []
    for booking in bookings:
        bkg_in_dict = booking.to_dict()
        booking_list.append(bkg_in_dict)

    return jsonify(booking_list)    
