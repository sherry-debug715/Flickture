import os
import requests
from app.models import db, environment, SCHEMA, User, Pin, PinImage, Category
from sqlalchemy.sql import text

access_key = os.environ.get("UNSPLASH_ACCESS_KEY")

# api_url = "https://api.unsplash.com/search/photos?query='puppy'&per_page=20"
# api_url = "https://api.unsplash.com/search/photos?query='cat'&per_page=20"
api_url = "https://api.unsplash.com/search/photos?query='dogs'&per_page=20"

def fetch_data_from_unsplash():
    url = api_url
    headers = {"Authorization": f"Client-ID {access_key}"}
    response = requests.get(url, headers=headers)
    # data = response.json()

    if response.status_code != 200:
        print(f'Failed to fetch data from Unsplash with status code: {response.status_code}')
        return []
    
    try:
        data = response.json()
    except ValueError:
        print(f'Failed to decode JSON from response: {response.text}')
        return []
    
    users = []
    default_image_description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

    results = data.get("results")
    for data in results:
        user_name = data["user"]["username"]
        organized_by_user = requests.get(f"https://api.unsplash.com/users/{user_name}/photos", headers=headers)
        each_user_info = organized_by_user.json()
        # each_user_info is an list of dictionary that has all the images that the user has posted
        each_user = each_user_info[0]
            # print("this is user_list", user_list)
        user_info = each_user["user"]
        user_entry = {}
        pins = []
        user_entry["first_name"] = user_info["first_name"]
        user_entry["last_name"] = user_info["last_name"] if user_info["last_name"] else "Flickture"
        user_entry["username"] = user_info["username"]
        user_entry["email"] = f'{user_info["username"]}@gmail.com'
        user_entry["profile_url"] = user_info["profile_image"]["small"]
        user_entry["password"] = "password"

        for data in each_user_info:
            each_pin = {}
            each_pin["title"] = data["alt_description"] if data["alt_description"] else "A beautiful picture"
            each_pin["description"] = data["description"] if data["description"] else default_image_description
            each_pin["image_url"] = data["urls"]["regular"]

            pins.append(each_pin)
        
        each_entry = {"user_info": user_entry, "pins": pins}

        users.append(each_entry)

    return users

def remove_dup(check_list):
    added = set()
    no_dup = []

    for pin_userInfo in check_list:
        user = pin_userInfo["user_info"]
        if user["username"] not in added:
            no_dup.append(pin_userInfo)
            added.add(user["username"])
    return no_dup


def seed_users_pins_and_pinImages():

    original_user_pins_data = fetch_data_from_unsplash()
    user_pins_data = remove_dup(original_user_pins_data)
    for each_user_pins in user_pins_data:
        user_info = each_user_pins["user_info"]
        new_user = User(
            first_name=user_info["first_name"],
            last_name=user_info["last_name"],
            username=user_info["username"],
            email=user_info["email"],
            profile_url=user_info["profile_url"],
            password="password"
        )
        db.session.add(new_user)
        db.session.flush()
    
        pins_list = each_user_pins["pins"]

        for each_pin in pins_list:
            new_pin = Pin(
                user_id=new_user.id,
                title=each_pin["title"],
                description=each_pin["description"]
            )

            db.session.add(new_pin)
            db.session.flush()

            new_pin_images = PinImage(
                user_id=new_user.id,
                pin_id=new_pin.id,
                image_url=each_pin["image_url"],
                preview=True
            )

            new_pin.pin_images.append(new_pin_images)

            new_pin_category1 = Category(
                pin_id=new_pin.id,
                name="pet",
            )

            new_pin_category2 = Category(
                pin_id=new_pin.id,
                name="cute",
            )

            new_pin_category3 = Category(
                pin_id=new_pin.id,
                name="cats",
            )

            new_pin_category4 = Category(
                pin_id=new_pin.id,
                name="kitten",
            )

            new_pin_category5 = Category(
                pin_id=new_pin.id,
                name="animal",
            )

            new_pin_category6 = Category(
                pin_id=new_pin.id,
                name="life",
            )


            new_pin.categories.append(new_pin_category1)
            new_pin.categories.append(new_pin_category2)
            new_pin.categories.append(new_pin_category3)
            new_pin.categories.append(new_pin_category4)
            new_pin.categories.append(new_pin_category5)
            new_pin.categories.append(new_pin_category6)


    db.session.commit()





# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users_pins_and_pinImages():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.pins RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.pin_images RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.categories RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        db.session.execute(text("DELETE FROM pins"))
        db.session.execute(text("DELETE FROM pin_images"))
        db.session.execute(text("DELETE FROM categories"))
    db.session.commit()
