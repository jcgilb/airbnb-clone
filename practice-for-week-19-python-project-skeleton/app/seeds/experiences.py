from ..models import User, environment, SCHEMA
from ..models.experiences import Experience, ExperienceImage, db
from sqlalchemy import func


def seed_experiences():
    exp1 = Experience(
        name="Private pottery wheel lesson",
        image_url="https://www.jumpintoart.com/uploads/1/0/6/2/10628591/s902277773334188845_p62_i11_w6000.jpeg?width=2560",
        host_id=1
        address="1403 Raleigh St, Denver, CO 80204",
        city="Denver",
        state="Colorado",
        country="U.S.A.",
        lat=39.742043,
        lng=-104.991531,
        description="Create a piece on the wheel from beginning to end with personal instruction and assistance.",
        price=89
    )
    exp2 = Experience(
        name="Goal-Setting Workshop w/Life Coach",
        image_url="https://lh3.googleusercontent.com/p/AF1QipNPTeqsY7kYZIpT7SV03kpH7-t_spBeFyea8KVx=s680-w680-h510",
        host_id=2,
        address="3330 Brighton Blvd, Denver, CO 80216",
        city="Denver",
        state="Colorado",
        country="U.S.A.",
        lat=39.742043,
        lng=-104.991531,
        description="Kim will walk you through a process filled with realistic, achievable and life-changing habits to help you achieve your goals and dreams.",
        price=80
    )
    exp3 = Experience(
        name="Learn Astrophotography in the Mountains",
        image_url="https://images.squarespace-cdn.com/content/v1/5b270b08c258b40799fa27fa/1556063131470-P35GYPWOFK3S6W1LCSE0/image-asset.jpeg",
        host_id=3,
        address="400 North Parkway, Breckenridge, CO 80424",
        city="Breckenridge",
        state="Colorado",
        country="U.S.A.",
        lat=39.482231,
        lng=-106.046181,
        description="Experience Colorado Astrophotography by taking stunning photos of the stars against the Rocky Mountains.",
        price=89
    )
    exp4 = Experience(
        name="Alpaca Palooza - Alpaca Encounters",
        image_url="https://d2l34t1fl9ccx8.cloudfront.net/media/image/icache/340x/a/l/alpacas-smooth-alpaca.jpg",
        host_id=3,
        address="18300 W Alameda Pkwy, Morrison, CO 80465",
        city="Morrison",
        state="Colorado",
        country="U.S.A.",
        lat=39.6592,
        lng=-105.2035,
        description="Our experiences are packed full of fun and surprises. We know Alpacas and can't wait to host you!",
        price=39
    )
    exp5 = Experience(
        name="Hike with an Adventure Photographer",
        image_url="https://dayhikesneardenver.b-cdn.net/wp-content/uploads/2019/12/HollyMandarich-1-dayhikesneardenver-interview.jpg",
        host_id=3, 
        address="Meeting point will depend on destination.",
        city="Denver",
        state="Colorado",
        country="U.S.A.",
        lat=39.6592,
        lng=-105.2035,
        description="This experience is perfect for Instagram, Facebook as well as proposals, corporate events, and special occasions!",
        price=150
    )

    db.session.add(exp1)
    db.session.add(exp2)
    db.session.add(exp3)
    db.session.add(exp4)
    db.session.add(exp5)
    db.session.commit()


def seed_experience_images():
    exp_image1 = ExperienceImage(
        exp_id=1,
        image_url="https://losangeleno.com/wp-content/uploads/2020/03/POTechopark.jpg", 
        preview=False
    )
    exp_image2 = ExperienceImage(
        exp_id=2,
        image_url="https://www.getyourguide.com/magazine/wp-content/migrated-content/uploads/2020/03/2020.03.27-10-things-you-didn_t-know-about-Paris-00-header.jpg", 
        preview=False
    )
    exp_image3 = ExperienceImage(
        exp_id=3,
        image_url="https://images.immediate.co.uk/production/volatile/sites/25/2021/03/astrophotography-beginner-guide-8724622-e1631797878243.jpg?quality=90&resize=921,614", 
        preview=False
    )
    exp_image4 = ExperienceImage(
        exp_id=4,
        image_url="https://a0.muscache.com/im/pictures/965138e2-fefa-43b3-b6ff-ffb4a9ba0c2b.jpg?im_w=1200", 
        preview=False
    )

    exp_image5 = ExperienceImage(
        exp_id=5,
        image_url="https://images.flytographer.com/583bcfc3-5aa6-4cc7-ba22-9f539c100126/breckenridge-couples-trip-couple-dog_1024.jpeg", 
        preview=False
    )
    db.session.add(exp_image1)
    db.session.add(exp_image2)
    db.session.add(exp_image3)
    db.session.add(exp_image4)
    db.session.add(exp_image5)
    db.session.commit()

def undo_experiences():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.experiences RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM experiences")

    db.session.commit()


def undo_exp_images():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.experience_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM experience_images")
    db.session.commit()

