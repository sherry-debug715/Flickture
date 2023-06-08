from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Pin, User, Category

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
