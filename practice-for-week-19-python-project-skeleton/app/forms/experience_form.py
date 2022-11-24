from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, FloatField, DateField, BooleanField, TextAreaField
from wtforms.validators import DataRequired, ValidationError

class ExperienceForm(FlaskForm):
    est_duration = IntegerField("Duration", validators=[DataRequired()])
    address = StringField("Address", validators=[DataRequired()])
    city = StringField("City", validators=[DataRequired()])
    state = StringField("State", validators=[DataRequired()])
    country = StringField("Country", validators=[DataRequired()])
    lat = FloatField("Latitude", validators=[DataRequired()])
    lng = FloatField("Longitude", validators=[DataRequired()])
    name = StringField("Name", validators=[DataRequired()])
    description = TextAreaField("Description", validators=[DataRequired()])
    price = IntegerField("Price", validators=[DataRequired()])
    
class ExperienceImageForm(FlaskForm):
    exp_id = IntegerField("Experience ID")
    image_url = StringField("Image URL", validators=[DataRequired()])
    preview = BooleanField("Preview", default=False)

