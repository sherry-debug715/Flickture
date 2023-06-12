from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Profile

board_routes = Blueprint("boards", __name__)

@board_routes.route('/user_boards')
@login_required
def user_boards():
    """
    Returns all profiles of a specific user identified by user_id
    """
    profiles = Profile.query.filter_by(user_id = current_user.id).all()

    profiles_toReturn = [profile.to_dict() for profile in profiles]
    
    return jsonify(profiles_toReturn)