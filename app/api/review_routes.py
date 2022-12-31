from flask import Blueprint, render_template, jsonify, request, send_file
from ..forms import ReviewImageForm
from app.models.experiences import db, Experience, ExperienceImage, experience_schema, experiences_schema, experience_image_schema, experience_images_schema
from app.models.reviews import db, Review, ReviewImage, review_schema, reviews_schema, review_image_schema, reviews_images_schema
from app.models.bookings import db, Booking, booking_schema, bookings_schema
from flask_login import login_required, current_user
from datetime import datetime
from app.models import User

import boto3
import botocore
from app.config import Config
from app.cool import *

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


@review_routes.route("/<int:rvw_id>/images", methods=['POST'])
@login_required
def upload_rvw_image(rvw_id):
    newFile = request.form.get('newFile')
    print(newFile, "newFile ****************************************")
    print(request.files['file'], "file ****************************************")
    if newFile == 'true':
        if "file" not in request.files:
            return "No user_file key in request.files"
        file = request.files['file']

        if file:
            review_id = request.form.get('review_id')
            file_url = upload_file_to_s3(file)
            print("file_url*************", file_url)
            image = ReviewImage(review_id=rvw_id, image_url=file_url["url"])
            db.session.add(image)
            db.session.commit()

            print("image************", image)
            return jsonify(review_image_schema.dump(image))

    if newFile == 'false':
        print("********************************")
        review_id = request.form.get('review_id')
        image_url = request.form.get('file')
        print(review_id)
        print(image_url)
        image = ReviewImage(review_id=review_id, image_url=image_url)
        db.session.add(image)
        db.session.commit()

        print("image************", image)

        return jsonify(review_image_schema.dump(image))

    # return {'message': 'cool'}
    
# @review_routes.route("/<int:rvw_id>/images", methods=["POST"])
# @login_required
# def upload_rvw_image(rvw_id):
#     """Upload a review image"""
#     print("helloWorld ********************************")

#     print("request.files****************************", request.files)

#     # if "image_url" not in request.files:
#     #     return {"errors": "image_url required"}, 400

#     image_url = request.files["image_url"]
#     print("image_url", image_url)


#     print("image_url.filename", image_url.filename)
#     if not allowed_file(image_url.filename):
#         return {"errors": "file type not permitted"}, 400
    
#     image_url.filename = get_unique_filename(image_url.filename)
    
#     upload = upload_file_to_s3(image_url)
#     print("upload", upload)

#     if "url" not in upload:
#         # if no url key, there was an upload error
#         return upload, 400

#     aws_img_url = upload["url"]

#     form = ReviewImageForm()
#     form['csrf_token'].data = request.cookies['csrf_token']
#     if form.validate_on_submit():
#         new_rvw_image = ReviewImage(
#             review_id=rvw_id, 
#             image_url=aws_img_url
#         )
#         db.session.add(new_image)
#         db.session.commit()
#         return jsonify(review_image_schema.dump(new_rvw_image))
