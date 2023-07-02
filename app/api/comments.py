from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Pin, Comment, User

comment_routes = Blueprint("comments", __name__)

@comment_routes.route('/edit/<int:pin_id>/<int:comment_id>', methods=["PUT"])
@login_required
def edit_comment(pin_id, comment_id):
    find_pin = Pin.query.get(pin_id)

    if find_pin is None:
        return jsonify({"error": "Pin not found"}), 404
    
    data = request.get_json()

    content = data["content"]

    edited_comment = Comment.query.get(comment_id)

    if edited_comment is None:
        return {"Error": f"Comment with id {comment_id} not found"}, 404
    
    user_id = current_user.id 

    edit_comment_user_id = edited_comment.user_id

    if user_id != edit_comment_user_id:
        return {"Error": "Only creator of the comment has acceess to edit the comment"}
    
    edited_comment.content = content

    db.session.add(edited_comment)
    db.session.commit()

    return jsonify(edited_comment.to_dict()), 200
  

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

@comment_routes.route('/all/<int:pin_id>')
def get_all_comments(pin_id):
    find_pin = Pin.query.get(pin_id)

    if find_pin is None:
        return jsonify({"error": "Pin not found"}), 404
    
    all_comments = Comment.query.filter_by(pin_id=pin_id).all()

    comments_toReturn = [comment.to_dict() for comment in all_comments]

    return jsonify(comments_toReturn)