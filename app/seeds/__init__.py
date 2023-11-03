from flask.cli import AppGroup
from .users_pins_pin_images import seed_users_pins_and_pinImages, undo_users_pins_and_pinImages
from .profiles import seed_profiles, undo_profiles
from .comments import seed_comments, undo_comments

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    # if environment == 'production':
    #     undo_users_pins_and_pinImages()
    #     undo_profiles()
    
    # seed_users_pins_and_pinImages()
    # seed_profiles()
    seed_comments()
    # Add other seed functions here
    # pass

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    # undo_profiles()
    # undo_users_pins_and_pinImages()
    undo_comments()
    # Add other undo functions here
    # pass
