from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Profile, User, Pin

board_routes = Blueprint("boards", __name__)

@board_routes.route('/user_boards/<int:user_id>')
@login_required
def user_boards(user_id):
    """
    Returns all profiles of a specific user identified by user_id
    """
    profiles = Profile.query.filter_by(user_id = user_id).all()

    profiles_toReturn = [profile.to_dict() for profile in profiles]
    
    return jsonify(profiles_toReturn)


@board_routes.route('/<int:board_id>')
@login_required
def board_detail(board_id):
    board = Profile.query.get(board_id)

    data_return = board.to_dict()
    
    pin_list = data_return["pins"]

    new_pin_list = []

    for pin_dic in pin_list:
        new_pin_dic = {}
        new_pin_dic["image_url"] = pin_dic["pin_images"][0]["image_url"]
        new_pin_dic["pin_id"] = pin_dic["pin_images"][0]["pin_id"]
        new_pin_dic["title"] = pin_dic["title"]
        user_id = pin_dic["pin_images"][0]["user_id"]
        new_pin_dic["user_id"] = user_id

        user = User.query.get(user_id).to_dict()

        new_pin_dic["username"] = user["username"]
        new_pin_dic["profile_url"] = user["profile_url"]
        new_pin_list.append(new_pin_dic)
    
    data_return["pins"] = new_pin_list

    return data_return


@board_routes.route('/create', methods=["POST"])
@login_required
def create_board():
    data = request.get_json()

    new_profile = Profile(
        user_id = current_user.id,
        name = data["name"],
        private = data["private"],
    )

    db.session.add(new_profile)
    db.session.commit()

    return new_profile.to_dict(), 201

@board_routes.route('/edit/<int:id>', methods=["PUT"])
@login_required
def edit_board(id):
    data = request.get_json()
 
    edited_board = Profile.query.get(id)

    if edit_board is None:
        return {"Error": "Board not found"}, 404
   
    name = data["name"]
    private = data["private"]

    edited_board.name = name
    edited_board.private = private

    db.session.add(edited_board)


    db.session.commit()
    return jsonify(edited_board.to_dict()), 200

@board_routes.route('/delete/<int:id>', methods=["DELETE"])
@login_required
def delete_board(id):
    board_to_delete = Profile.query.get(id)

    if not board_to_delete:
        return {"Error": "Board not found"}, 404

    db.session.delete(board_to_delete)
    db.session.commit()
    return jsonify({"message": "Board deleted successfully"}), 200

@board_routes.route('/add_pin_to_board/<int:pin_id>/<int:board_id>', methods=["POST"])
@login_required
def save_pin_to_board(pin_id, board_id):
    selected_board = Profile.query.get(board_id)

    if not selected_board:
        return {"Error": "Board not found"}, 404
    
    saved_pin = Pin.query.get(pin_id)

    if not saved_pin:
        return {"Error": "Pin not found"}, 404
    
    selected_board.pins.append(saved_pin)

    db.session.commit()

    return jsonify({"message": "Pin saved to board successfully"}), 200

@board_routes.route('/remove_pin_from_board/<int:pin_id>/<int:board_id>', methods=["DELETE"])
@login_required
def remove_pin_from_board(pin_id, board_id):
    find_board = Profile.query.get(board_id)

    if not find_board:
        return {"Error": "Board not found"}, 404
    
    if find_board.user_id != current_user.id:
        return {"Error": "Not authorized to modify this board"}, 403
    
    pin_to_remove = Pin.query.get(pin_id)

    if not pin_to_remove:
        return {"Error": "Pin not found"}, 404
    
    if pin_to_remove not in find_board.pins:
        return {"Error": "This pin is not associated with the board"}, 400
    
    find_board.pins.remove(pin_to_remove)
    
    db.session.commit()

    return {"Success": "Pin removed from board"}, 200







