from ..models import User, environment, SCHEMA
from ..models.reviews import Review, ReviewImage, db
from sqlalchemy import func


def seed_reviews():
    rvw1 = Review(
        exp_id=1,
        user_id=6,
        review_body="This was an amazing experience!",
        stars=5
    )
    rvw2 = Review(
        exp_id=2,
        user_id=7,
        review_body="This was an amazing experience!",
        stars=5
    )
    rvw3 = Review(
        exp_id=3,
        user_id=8,
        review_body="This was an amazing experience!",
        stars=5
    )
    rvw4 = Review(
        exp_id=4,
        user_id=9,
        review_body="This was an amazing experience!",
        stars=5
    )
    rvw5 = Review(
        exp_id=5,
        user_id=10,
        review_body="This was an amazing experience!",
        stars=5
    )

    db.session.add(rvw1)
    db.session.add(rvw2)
    db.session.add(rvw3)
    db.session.add(rvw4)
    db.session.add(rvw5)
    db.session.commit()


def seed_review_images():
    rvw_image1 = ReviewImage(
        review_id=1,
        image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSnPVG9aNBcXNVy--OitqTafpfHYMNV9giVA&usqp=CAU", 
        
    )
    rvw_image2 = ReviewImage(
        review_id=2,
        image_url="https://global-uploads.webflow.com/632264efe4bf88d3b73ab56c/634324b5e2412dde9ccb6e76_Life-Coaching-Topics-to-Bring-to-Your-Next-Life-Coaching-Session-woman-video-chatting-a-life-coach-on-a-video-call-at-dining-room-table.jpeg"
        
    )
    rvw_image3 = ReviewImage(
        review_id=3,
        image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO6iTBZzXZUC2zwh86LBdsQ6tliKHyw3D5lw&usqp=CAU", 
        
    )
    rvw_image4 = ReviewImage(
        review_id=4,
        image_url="https://milehighfarms.com/images/igallery/resized/1-100/mile-high-farms-alpaca-26-1600-1000-80.jpg", 
        
    )

    rvw_image5 = ReviewImage(
        review_id=5,
        image_url="https://dayhikesneardenver.b-cdn.net/wp-content/uploads/2019/12/HollyMandarich-0-1.jpg", 
        
    )
    db.session.add(rvw_image1)
    db.session.add(rvw_image2)
    db.session.add(rvw_image3)
    db.session.add(rvw_image4)
    db.session.add(rvw_image5)
    db.session.commit()

def undo_reviews():
    # if environment == "production":
    #     db.session.execute(
    #         f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    # else:
    db.session.execute("DELETE FROM reviews")
    db.session.commit()


def undo_review_images():
    # if environment == "production":
    #     db.session.execute(
    #         f"TRUNCATE table {SCHEMA}.review_images RESTART IDENTITY CASCADE;")
    # else:
    db.session.execute("DELETE FROM review_images")
    db.session.commit()
