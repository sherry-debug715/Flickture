from app.models import db, Profile, User

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
    db.session.execute('TRUNCATE profiles RESTART IDENTITY CASCADE;')
    db.session.commit()




