from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Pin, User, Category, PinImage, Profile
from app.aws import upload_file_to_s3, get_unique_filename

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

@pin_routes.route('/create', methods=["POST"])
@login_required
def create_pin_image():
    """
    Creates a new pin and its image
    """
    if "image" not in request.files:
        return {"errors": "image required"}, 400

    image = request.files["image"]
    description = request.form.get("description")
    title = request.form.get("title")

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

    new_pin_image = PinImage(
        user_id = current_user.id, 
        pin_id = new_pin.id,
        image_url = url,
        preview = True
    )

    new_pin.pin_images.append(new_pin_image)
    
    db.session.commit()
    return new_pin.get_all_pins()


        