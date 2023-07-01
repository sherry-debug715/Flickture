from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Pin, Comment, User

comment_routes = Blueprint("comments", __name__)

@comment_routes.route('/create/<int:pin_id>', methods=["POST"])
@login_required
def create_comment(pin_id):
    find_pin = Pin.query.get(pin_id)

    if find_pin is None:
        return jsonify({"error": "Pin not found"}), 404

    user_id = current_user.id 

    data = request.get_json()

    new_comment = Comment(
        user_id = user_id,
        pin_id = find_pin.id,
        content = data["content"]
    )

    db.session.add(new_comment)
    db.session.commit()

    return new_comment.to_dict(), 201