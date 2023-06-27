from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Pin, User, Category, PinImage, Profile, SavedPin
from app.aws import upload_file_to_s3, get_unique_filename, remove_file_from_s3, S3_LOCATION

pin_routes = Blueprint('pins', __name__)

@pin_routes.route('/same_categories/<int:id>')
def pins_of_same_category(id):
    pin = Pin.query.get(id)

    if pin is None:
        return {"error": "Pin not found"}, 404
    

    pin_categories = [category.name for category in pin.categories]

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('size', 20, type=int)

    pins = []

    pins_with_same_categories = Pin.query.filter(
    Pin.categories.any(Category.name.in_(pin_categories))
    ).paginate(page=page, per_page=per_page)

    organizePin = [pin.get_all_pins() for pin in pins_with_same_categories.items]

    pinArr = []

    for eachPin in organizePin:
        pinToSendBack = {}
        pinToSendBack["creator"] = eachPin["creator"]
        pinToSendBack["id"] = eachPin["id"]
        pinToSendBack["pin_images"] = eachPin["pin_images"][0]["image_url"]
        pinToSendBack["title"] = eachPin["title"]
        pinToSendBack["pin_comments"] = eachPin["pin_comments"]
        pinArr.append(pinToSendBack)

    result = {
        "pins": pinArr,
        "total_pages": pins_with_same_categories.pages,
        "total_items": pins_with_same_categories.total,
        "current_page": pins_with_same_categories.page,
    }

    return jsonify(result)

@pin_routes.route('/')
def get_all_pins():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('size', 20, type=int)

    all_pins = Pin.query.paginate(page, per_page, error_out=False)


    pins = []

    for pin in all_pins.items:
        each_pin = pin.get_all_pins()

        adjust_creator = {key: each_pin['creator'][key] for key in ['username', 'profile_url']}
        each_pin['creator'] = adjust_creator

        adjust_pinImages = [image for image in each_pin['pin_images'] if image['preview']]

        each_pin['pin_images'] = adjust_pinImages[0]['image_url']

        pins.append(each_pin)

    return jsonify({
        "pins": pins,
        "total": all_pins.total,
        "pages": all_pins.pages,
        "current_page": all_pins.page
    })


@pin_routes.route('/<int:id>')
def get_one_pin(id):
    pin = Pin.query.get(id)
    data_return = pin.get_all_pins()

    user = User.query.get(data_return['user_id']).to_dict()
    # followers = user.followers

    data_return["followers"] = user["followers"]


    return data_return


@pin_routes.route('/edit/<int:id>', methods=["PUT"])
@login_required
def edit_pin(id):
    """
    Edit a pin by it's id, 
    edit the board that the pin belongs to.
    """
    pin = Pin.query.get(id)

    if not pin:
        return jsonify(message="Pin not found"), 404
    
    updated_pin_info = request.get_json()

    title = updated_pin_info.get("title")

    description = updated_pin_info.get("description")

    selectedBoardId = updated_pin_info.get("selectedBoardId")

    oldBoardId = updated_pin_info.get("boardId")

    if title is not None and description is not None:
        pin.title = title
        pin.description = description

    if selectedBoardId != oldBoardId:
        old_pin_board = Profile.query.filter_by(user_id=current_user.id, id=oldBoardId).first()

        if old_pin_board.name != "All Pins":
            old_pin_board.pins.remove(pin)

    if selectedBoardId is not None:
        selected_new_pin_profile = Profile.query.filter_by(user_id=current_user.id, id=selectedBoardId).first()

        selected_board = selected_new_pin_profile.to_dict()

        if selected_board["name"] != "All Pins":
            selected_new_pin_profile.pins.append(pin)
    
    try:
        db.session.commit()
        return jsonify(pin.get_all_pins()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(message=str(e)), 400


@pin_routes.route('/create', methods=["POST"])
@login_required
def create_pin_image():
    """
    Creates a new pin and its image,
    if user selects a board for the pin,
    add the new pin to the selected board
    """
    if "image" not in request.files:
        return {"errors": "image required"}, 400

    image = request.files["image"]
    description = request.form.get("description")
    title = request.form.get("title")
    selectedBoardId = request.form.get("selectedBoardId")

    image.filename = get_unique_filename(image.filename)

    upload = upload_file_to_s3(image)

    if "url" not in upload:
        return {"error": upload}, 404
        
    url = upload["url"]

    new_pin = Pin(
        user_id=current_user.id,
        title = title,
        description = description
    )

    db.session.add(new_pin)
    db.session.flush()

    # Get the "All Pins" profile of the current user
    all_pins_profile = Profile.query.filter_by(user_id=current_user.id, name="All Pins").first()

    if all_pins_profile is None:
        return {"error": "All Pins profile not found for the current user"}, 404
    
    # Append the new pin to the "All Pins" profile
    all_pins_profile.pins.append(new_pin)

    # Find the profile by the selectedBoardId of the current user
    if selectedBoardId is not None:
        selected_new_pin_profile = Profile.query.filter_by(user_id=current_user.id, id=selectedBoardId).first()

        selected_board = selected_new_pin_profile.to_dict()

        if selected_board["name"] != "All Pins":
            selected_new_pin_profile.pins.append(new_pin)

    new_pin_image = PinImage(
        user_id = current_user.id, 
        pin_id = new_pin.id,
        image_url = url,
        preview = True
    )

    new_pin.pin_images.append(new_pin_image)
    
    db.session.commit()
    return new_pin.get_all_pins()

@pin_routes.route('/delete/<int:id>', methods=["DELETE"])
@login_required
def delete_pin(id):
    pin_to_delete = Pin.query.get(id)

    if pin_to_delete is None:
        return jsonify({"error": "Pin not found"}), 404

    for pin_image in pin_to_delete.pin_images:
        if S3_LOCATION in pin_image.image_url:
            result = remove_file_from_s3(pin_image.image_url)
            if isinstance(result, dict) and "errors" in result:
                return jsonify(result), 500
            
            db.session.delete(pin_image)
    
    db.session.delete(pin_to_delete)

    try:
        db.session.commit()
        return jsonify({"message": "Pin deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@pin_routes.route('/save_pin/<int:pin_id>', methods=['POST'])
@login_required
def save_pin(pin_id):
    pin_to_save = Pin.query.get(pin_id)

    if pin_to_save is None:
        return jsonify({"error": "Pin not found"}), 404
    
    user_id = current_user.id

    new_saved_pin = SavedPin(
        user_id = user_id,
        pin_id = pin_id
    )

    db.session.add(new_saved_pin)
    
    try:
        db.session.commit()
        return jsonify({"message": "Pin saved successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@pin_routes.route('/all_pins/saved/<int:user_id>')
@login_required
def all_pins_saved(user_id):
    # Check if the current user is trying to access their own saved pins
    if current_user.id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    saved_pins = SavedPin.query.filter(SavedPin.user_id == user_id).all()

    return jsonify([pin.to_dict() for pin in saved_pins])