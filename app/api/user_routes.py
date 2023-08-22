from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db
from app.aws import upload_file_to_s3, get_unique_filename, remove_file_from_s3, S3_LOCATION

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/user_profile/<int:user_id>')
def userInfo(user_id):
    user = User.query.get(user_id)
    return user.to_dict()



@user_routes.route('/user_profile/edit/<int:user_id>', methods=["PATCH"])
@login_required
def edit_user(user_id):
    """
    Edit user information by user id
    """
    user = User.query.get(user_id)

    if not user:
        return jsonify(message="User not found"), 404 
    
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    username = request.form.get("username")
    email = request.form.get("email")

    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name
    if username:
        user.username = username
    if email:
        user.email = email

    if "image" in request.files:
        upload = upload_file_to_s3(request.files["image"])
        if "url" not in upload:
            return {"error": upload}, 404
        
        user.profile_url = upload["url"] 

    db.session.commit()
    return jsonify(user.basic()), 200


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.basic()

@user_routes.route('/follow/<int:user_id>', methods=['POST'])
@login_required
def follow(user_id):
    try:
        user_to_follow = User.query.get(user_id)
        if not user_to_follow:
            return jsonify({"error": "User not found"}), 404
        current_user.follow(user_to_follow)
        db.session.commit()

        return jsonify({"id": current_user.id, "profile_url": current_user.profile_url, "username":current_user.username}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@user_routes.route('/unfollow/<int:user_id>', methods=['POST'])
@login_required
def unfollow(user_id):
        user_to_unfollow = User.query.get(user_id)

        if not user_to_unfollow:
            return jsonify({"error": "User not found"}), 404

        if(current_user.is_following(user_to_unfollow)):
            current_user.unfollow(user_to_unfollow)
            db.session.commit()
            return jsonify({"id": current_user.id, "profile_url": current_user.profile_url, "username":current_user.username}), 200
        else:
            return jsonify({"error": f"You never followed user {user_id}"}), 400


