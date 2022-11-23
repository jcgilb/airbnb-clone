from flask_wtf import FlaskForm
from wtforms import IntegerField, DateField
from wtforms.validators import DataRequired, ValidationError

class BookingForm(FlaskForm):
    exp_id = IntegerField("Experience ID", validators=[DataRequired()])
    user_id = IntegerField("User ID", validators=[DataRequired()])
    start_date = DateField("Start time", validators=[DataRequired()])
    end_date = DateField("End time", validators=[DataRequired()])

class EditBookingForm(FlaskForm):
    start_date = DateField("Start time", validators=[DataRequired()])
    end_date = DateField("End time", validators=[DataRequired()])

