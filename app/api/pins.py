from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Pin

pin_routes = Blueprint('pins', __name__)

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
