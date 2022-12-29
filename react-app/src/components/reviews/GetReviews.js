import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useParams, useHistory } from "react-router";
import { getAllReviews } from "../../store/reviews.js";
import CreateReview from "./CreateReview.js";
import "./GetReviews.css";

function GetReviews() {
  const dispatch = useDispatch();

  // parse exp id from url
  let { expId } = useParams();
  expId = parseInt(expId);

  useEffect(() => {
    dispatch(getAllReviews(expId));
  }, [dispatch]);

  // get comment body, set comment body
  const [users, setUsers] = useState([]);
  // identify the current user
  const reviews = useSelector((state) => state.reviews.reviews);
  const reviewArray = Object.values(reviews);
  console.log(reviewArray);

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
    return (
      <div className="star-rating">
        <i className="fa-sharp fa-solid fa-star"></i>
        <span>{sum / total}</span>(<span>{`${total} reviews`}</span>)
      </div>
    );
  };

  if (!reviewArray.length) return null;

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
            <span>
              <div>{getUsername(rvw.user_id)}</div>
              <div>{rvw.created_at}</div>
            </span>
          </div>
          <div>{rvw.review_body}</div>
        </div>
      ))}
      <CreateReview />
    </div>
  );
}

export default GetReviews;
