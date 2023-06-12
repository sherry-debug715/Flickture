from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Profile

board_routes = Blueprint("boards", __name__);

@board_routes.routes("/<int:userId>/user_boards")
def user_boards(userId):
    boards = Profile.query.filter(Profile.user_id == userId)

    