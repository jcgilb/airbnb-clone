from flask.cli import AppGroup
from .users import seed_users, undo_users
from .reviews import seed_reviews, seed_review_images, undo_reviews, undo_review_images
from .experiences import seed_experiences, seed_experience_images, seed_time_slots, undo_time_slots, undo_experiences, undo_experience_images
from .bookings import seed_bookings, undo_bookings

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_experiences()
        undo_experience_images()
        undo_time_slots()
        undo_bookings()
        undo_reviews()
        undo_review_images()
        undo_users()
    seed_users()
    seed_experiences()
    seed_experience_images()
    seed_time_slots()
    seed_bookings()
    seed_reviews()
    seed_review_images()    
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_experiences()
    undo_experience_images()
    undo_time_slots()
    undo_bookings()
    undo_reviews()
    undo_review_images()
    # Add other undo functions here