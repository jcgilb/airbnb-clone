from flask import Blueprint, render_template, jsonify, request, send_file
from flask_login import login_required, current_user

from app.config import Config
from app.models import User
from app.models.experiences import db, Experience, ExperienceImage, experience_schema, experiences_schema, experience_image_schema, experience_images_schema
from app.models.reviews import db, Review, ReviewImage, review_schema, reviews_schema, review_image_schema, reviews_images_schema
from app.models.bookings import db, Booking, booking_schema, bookings_schema
from app.cool import *

from datetime import datetime
import botocore
import boto3


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
    review = Review.query.get(rvw_id)
    newFile = request.form.get('newFile')
    if newFile == 'true':
        if "file" not in request.files:
            return "No file key in request.files"
        file = request.files['file']
        rvw_dict = review.to_dict()
        images = rvw_dict["review_images"]
        if file:
            review_id = request.form.get('review_id')
            file_url = upload_file_to_s3(file)
            image = ReviewImage(
                review_id=rvw_id, 
                image_url=file_url["url"]
            )
            db.session.add(image)
            db.session.commit()
            images.append(image.to_dict())
            # return jsonify(review_image_schema.dump(image))
            return review.to_dict()

    if newFile == 'false':
        review_id = request.form.get('review_id')
        image_url = request.form.get('file')
        image = ReviewImage(
            review_id=review_id, 
            image_url=image_url
        )
        db.session.add(image)
        db.session.commit()
        return jsonify(review_image_schema.dump(image))

@review_routes.route('/<int:rvw_id>/images/<int:img_id>', methods=["DELETE"])
def delete_a_rvw_image(rvw_id, img_id):
    """Delete a review image"""

    review = Review.query.get(rvw_id)
    image = ReviewImage.query.get(img_id)

    if not review:
        return "Review does not exist.", 404

    if not image:
        return "Image does not exist.", 404    

    if review.user_id == current_user.id or experience.host_id == current_user.id: 
        # dont delete the image from the bucket for now
        # if "amazonaws" in image.image_url:
        #     filename = image.image_url.split("/")[-1]
        #     delete_image_from_s3(filename)
            
        db.session.delete(image)

        images = review.review_images
        for img in images:
            imgDict = img.to_dict()
            if (imgDict["id"] == img_id):
                db.session.delete(img)

        db.session.commit()
        return "Image successfully deleted.", 200

    else: 
        return "Permission denied.", 401          

    
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
