from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, ValidationError

class BookingForm(FlaskForm):
    exp_id = IntegerField("Experience ID")
    user_id = IntegerField("User ID", validators=[DataRequired()])
    time_slot_id = IntegerField("Time Slot ID", validators=[DataRequired()]) 
    

class EditBookingForm(FlaskForm):
    time_slot_id = IntegerField("Time Slot ID", validators=[DataRequired()])
    


# from flask_wtf import FlaskForm
# from wtforms import IntegerField, StringField
# from wtforms.validators import DataRequired, ValidationError

# class BookingForm(FlaskForm):
#     exp_id = IntegerField("Experience ID")
#     user_id = IntegerField("User ID", validators=[DataRequired()])
#     start_date =StringField("Start time", validators=[DataRequired()])
    

# class EditBookingForm(FlaskForm):
#     start_date = StringField("Start time", validators=[DataRequired()])
#     # end_date = DateField("End time", validators=[DataRequired()])
