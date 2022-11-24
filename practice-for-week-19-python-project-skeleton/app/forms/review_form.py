from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, ValidationError

class ReviewForm(FlaskForm):
    exp_id = IntegerField("Experience ID", validators=[DataRequired()])
    user_id = IntegerField("User ID")
    review_body = StringField("Review", validators=[DataRequired()])
    stars = IntegerField("Stars", validators=[DataRequired()])


class ReviewImageForm(FlaskForm):
    review_id = IntegerField("Review ID", validators=[DataRequired()])
    image_url = StringField("Image URL", validators=[DataRequired()])

