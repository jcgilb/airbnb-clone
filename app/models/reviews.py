from sqlalchemy import func
from sqlalchemy.orm import validates
from .db import db, ma, environment, SCHEMA,

class Review(db.Model):
    __tablename__ = "reviews"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exp_id = db.Column(db.Integer, db.ForeignKey("experiences.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    review_body = db.Column(db.String(), nullable=False)
    stars = db.Column(db.Integer(), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True),server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    review_images = db.relationship("ReviewImage", backref="review")
    # review_author = db.relationship("User", back_populates="review")
    exp_review = db.relationship("Experience", back_populates="reviews")

    def to_dict(self):
        return {
            'id': self.id,
            'exp_id': self.exp_id,
            'user_id': self.user_id,
            'review_body': self.review_body,
            'stars': self.stars,
            'review_images': [self.review_image.to_dict() for self.review_image in self.review_images],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class ReviewImage(db.Model):
    __tablename__ = "review_images"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255))
    review_id = db.Column(db.Integer(), db.ForeignKey("reviews.id"), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True),server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'image_url': self.image_url,
            'review_id': self.review_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }        

class ReviewSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "user_id",
            "exp_id",
            "review_body",
            "stars",
            "created_at", 
            "updated_at")

class ReviewImageSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "review_id",
            "image_url", 
            "created_at", 
            "updated_at")


review_schema = ReviewSchema()
reviews_schema = ReviewSchema(many=True)

review_image_schema = ReviewImageSchema()
reviews_images_schema = ReviewImageSchema(many=True)

