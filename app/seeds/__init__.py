from flask.cli import AppGroup
from .users_pins_pin_images import seed_users_pins_and_pinImages, undo_users_pins_and_pinImages

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    seed_users_pins_and_pinImages()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users_pins_and_pinImages()
    # Add other undo functions here
