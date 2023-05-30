from app.models import db, environment, SCHEMA, Profile, User
from sqlalchemy.sql import text

def seed_profiles():
    all_user = User.query.all()

    for user in all_user:
        new_profile = Profile(
            user_id = user.id,
            name="All Pins",
            private=True
        )

        user.profiles.append(new_profile)

    db.session.commit()

def undo_profiles():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.profiles RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM profiles"))
    db.session.commit()




