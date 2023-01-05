import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import {
  clearReviews,
  getAllReviews,
  deleteRvwImage,
} from "../../store/reviews.js";
import CreateReview from "./CreateReview.js";
import DeleteReview from "./DeleteReview.js";
import "./GetReviews.css";

function GetReviews2() {
  const dispatch = useDispatch();
  const history = useHistory();

  // parse exp id from url
  let { expId } = useParams();
  expId = parseInt(expId);

  // identify the current user
  const user = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews.reviews);
  const rvwImages = useSelector((state) => state.images.rvwImages);
  const reviewArray = Object.values(reviews);

  // get comment body, set comment body
  const [users, setUsers] = useState([]);
  const [reviewArr, setReviewArr] = useState(reviewArray);

  useEffect(() => {
    dispatch(getAllReviews(expId));
    return () => {
      dispatch(clearReviews());
    };
  }, [dispatch, expId, rvwImages]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/experiences/${expId}/reviews`);
      const responseData = await response.json();
      setReviewArr(responseData);
      console.log("reviewArr", reviewArr);
    }
    fetchData();
  }, [reviews]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      setUsers(responseData.users);
    }
    fetchData();
  }, []);

  const getUsername = (userId) => {
    let user = users?.find((user) => user?.id === userId);
    return user?.username;
  };
  const getProfilePic = (userId) => {
    let user = users?.find((user) => user?.id === userId);
    if (!user?.image_url) return "../../assets/default-image-localXP.png";
    return user?.image_url;
  };
  const getAvgStars = (reviewArray) => {
    let sum = 0;
    let total = reviewArray.length;
    for (let rvw of reviewArray) {
      sum += rvw.stars;
    }
    let avg = +(sum / total).toFixed(2);
    if (isNaN(avg)) {
      return <div className="star-rating">No reviews</div>;
    } else {
      return (
        <div className="star-rating">
          <i className="fa-sharp fa-solid fa-star star"></i>
          <span className="star">{avg}</span>(<span>{`${total} reviews`}</span>)
        </div>
      );
    }
  };

  return (
    <div className="rvws-container">
      <div className="details">{getAvgStars(reviewArray)}</div>
      <CreateReview />
      {Object.values(reviews)
        .reverse()
        .map((rvw) => (
          <div className="each-rvw">
            <div className="pic-name-timestamp">
              <img
                className="rvw-profile-pic"
                alt="profile-pic"
                onError={(e) => {
                  e.target.src = "../../assets/default-image-localXP.png";
                }}
                src={getProfilePic(rvw?.user_id)}
              ></img>
              <span className="rvw-username-timestamp">
                <div>{getUsername(rvw?.user_id)}</div>
                <div>{rvw.created_at}</div>
              </span>
            </div>
            {rvw.user_id === user?.id && (
              <div
                className="add-img"
                onClick={() =>
                  history.push(
                    `/experiences/${expId}/reviews/${rvw?.id}/upload`
                  )
                }
              >
                <div className="add-rvw-img">Add review images</div>
                <div className="add-rvw-img">
                  <i className="fa-solid fa-plus" />
                </div>
              </div>
            )}
            <div className="rvw-images">
              {rvw?.review_images?.map((image, index) => (
                <div key={index} className="image-item">
                  <div className="image-item">
                    <div
                      className="delete-rvw-image"
                      onClick={async () => {
                        await dispatch(deleteRvwImage(rvw.id, image.id));
                        await dispatch(getAllReviews(expId));
                        history.push(`/experiences/${expId}`);
                      }}
                    >
                      <i className="fa-solid fa-x" />
                    </div>
                    <img
                      className="rvw-image-uploads"
                      src={image.image_url}
                      alt="rvw-img"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="review-section">
              <div className="rvw-body">{rvw.review_body}</div>
              <div className="delete-review">
                <DeleteReview rvw={rvw} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default GetReviews2;
