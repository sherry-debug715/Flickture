from app.models import db, environment, SCHEMA, User, Pin, Comment 
from sqlalchemy.sql import text

def seed_comments():
    # user id 3, 5 comments on every pins that were not created by them. 
    # user id 2, 4 comments on every pins that were not created by them. 
    pins = Pin.query.filter(Pin.user_id != 2, Pin.user_id != 4).all() 
    # content1 = "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    # content2 = "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
    content1 = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
    content2 = "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."

    for pin in pins:
        new_comment_1 = Comment(
            user_id = 2,
            pin_id = pin.id,
            content = content1
        )
        db.session.add(new_comment_1)

        new_comment_2 = Comment(
            user_id = 4,
            pin_id = pin.id,
            content = content2
        )
        db.session.add(new_comment_2)
    
    db.session.commit() 

def undo_comments():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
    db.session.commit()