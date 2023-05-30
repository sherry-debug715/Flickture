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
        pins.append(pin.get_all_pins())

    return jsonify({
        "pins": pins,
        "total": all_pins.total,
        "pages": all_pins.pages,
        "current_page": all_pins.page
    })
