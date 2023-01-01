import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { deleteRvwImage } from "../../store/images.js";
import { clearReviews, getAllReviews } from "../../store/reviews.js";
import UploadReviewImage from "../images/RvwImage.js";
import CreateReview from "./CreateReview.js";
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
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    console.log(expId, "expId");
    dispatch(getAllReviews(expId));
    return () => {
      dispatch(clearReviews());
    };
  }, [dispatch, expId, rvwImages]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      setUsers(responseData.users);
    }
    fetchData();
  }, []);

  const getUsername = (userId) => {
    let user = users.find((user) => user.id === userId);
    return user?.username;
  };
  const getProfilePic = (userId) => {
    let user = users.find((user) => user.id === userId);
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
          <i className="fa-sharp fa-solid fa-star"></i>
          <span>{avg}</span>(<span>{`${total} reviews`}</span>)
        </div>
      );
    }
  };

  return (
    <div className="">
      <div>{getAvgStars(reviewArray)}</div>
      {Object.values(reviews).map((rvw) => (
        <div className="each-rvw">
          <div className="pic-name-timestamp">
            <img
              className="rvw-profile-pic"
              alt="profile-pic"
              onError={(e) => {
                e.target.src = "../../assets/default-image-localXP.png";
              }}
              src={getProfilePic(rvw.user_id)}
            ></img>
            <span className="rvw-username-timestamp">
              <div>{getUsername(rvw.user_id)}</div>
              <div>{rvw.created_at}</div>
            </span>
          </div>
          {rvw.user_id === user.id && (
            <div
              onClick={() =>
                history.push(`/experiences/${expId}/reviews/${rvw.id}/upload`)
              }
            >
              Add review images +
            </div>
          )}
          <div className="rvw-images">
            {rvw.review_images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.image_url} alt="" width="100" />
                <div className="images-to-submit">
                  <button
                    onClick={async () => {
                      await dispatch(deleteRvwImage(rvw.id, image.id));
                      return history.push(`/experiences/${expId}`);
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="rvw-body">{rvw.review_body}</div>
        </div>
      ))}
      <CreateReview />
    </div>
  );
}

export default GetReviews2;
