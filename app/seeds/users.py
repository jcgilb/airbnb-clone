from app.models import db, User, environment, SCHEMA


# Adds a demo user, you can add other users here if you want
def seed_users():
    user1 = User(
        username='Demo', 
        email='demo@aa.io', 
        password='password', 
        first_name="Demo", 
        last_name="User", 
        )
    user2 = User(
        username='marnie', email='marnie@aa.io', password='password', first_name="Marnie", 
        last_name="User", )
    user3 = User(
        username='bobbie', email='bobbie@aa.io', password='password',first_name="Bobbie", 
        last_name="User", )
    user4 = User(
        username='Peter', 
        email='peter@aa.io', 
        password='password', 
        first_name="Peter", 
        last_name="User", 
        )
    user5 = User(
        username='Kim_user', 
        email='kim@aa.io', 
        password='password', 
        first_name="Kim", 
        last_name="User")    
    user6 = User(
        username='Kevin', 
        email='kevin@aa.io', 
        password='password', 
        first_name="Kevin", 
        last_name="User", 
        )

    user7 = User(
        username='Micah', 
        email='micah@aa.io', 
        password='password', 
        first_name="Micah", 
        last_name="User", 
        )
    user8 = User(
        username='Emma', 
        email='emma@aa.io', 
        password='password', 
        first_name="Emma", 
        last_name="User", 
        )
    user9 = User(
        username='James', 
        email='james@aa.io', 
        password='password', 
        first_name="James", 
        last_name="User", 
        )
    user10 = User(
        username='Anna', 
        email='anna@aa.io', 
        password='password', 
        first_name="Anna", 
        last_name="User", 
        )                    
    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.add(user4)
    db.session.add(user5)
    db.session.add(user6)
    db.session.add(user7)
    db.session.add(user8)
    db.session.add(user9)
    db.session.add(user10)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    # if environment == "production":
    #     db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    # else:
    db.session.execute("DELETE FROM users")
        
    db.session.commit()