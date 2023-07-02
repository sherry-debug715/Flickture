from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Pin, Comment, User

comment_routes = Blueprint("comments", __name__)

@comment_routes.route('/delete/<int:pin_id>/<int:comment_id>', methods=["DELETE"])
@login_required
def delete_comment(pin_id, comment_id):
    comment_to_delete = Comment.query.get(comment_id)

    if not comment_to_delete:
        return {"Error": f"Comment with id of {comment_id} is not found"}, 404
    
    find_pin = Pin.query.get(pin_id)

    if not find_pin:
        return {"Error": f"Pin with id of {pin_id} is not found"}, 404
    
    find_pin_dic = find_pin.get_all_pins()
    
    pin_comments = find_pin_dic["pin_comments"]

    if comment_to_delete.to_dict() not in pin_comments:
        return {"Error": f"Comment with id of {comment_id} doesn't belong to pin id {pin_id}"}
    
    db.session.delete(comment_to_delete)
    db.session.commit()
    return jsonify({"message": "Comment deleted successfully"}), 200
    

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