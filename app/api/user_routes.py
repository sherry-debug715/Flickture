from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, db

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


@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()

@user_routes.route('/follow/<int:user_id>', methods=['POST'])
@login_required
def follow(user_id):
    try:
        user_to_follow = User.query.get(user_id)
        if not user_to_follow:
            return jsonify({"error": "User not found"}), 404
        current_user.follow(user_to_follow)
        db.session.commit()

        return jsonify({"id": user_to_follow.id, "profile_url": user_to_follow.profile_url, "username":user_to_follow.username}), 200
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
            return jsonify({"id": user_to_unfollow.id, "profile_url": user_to_unfollow.profile_url, "username":user_to_unfollow.username}), 200
        else:
            return jsonify({"error": f"You never followed user {user_id}"}), 400


