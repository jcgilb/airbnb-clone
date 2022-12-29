import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useParams, useHistory } from "react-router";
import { getAllExperiences } from "../../store/experiences";
import { createOneReview, getAllReviews } from "../../store/reviews.js";

function CreateReview() {
  const dispatch = useDispatch();
  const history = useHistory();

  // parse exp id from url
  let { expId } = useParams();
  expId = parseInt(expId);

  useEffect(() => {
    dispatch(getAllExperiences());
    dispatch(getAllReviews(expId));
  }, [dispatch]);

  // get comment body, set comment body
  const [body, setBody] = useState("");
  const numStars = [1, 2, 3, 4, 5];
  const [starSelect, setStarSelect] = useState();
  const [users, setUsers] = useState([]);
  const experiences = useSelector((state) => state.experiences.experiences);
  // identify the exp from the url
  const exp = Object.values(experiences).find(
    (exp) => exp.id === parseInt(expId)
  );
  // identify the current user
  const user = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => state.reviews.reviews);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      setUsers(responseData.users);
    }
    fetchData();
  }, []);

  // helper function for clearing the input
  const revert = () => {
    setBody("");
    setStarSelect("");
  };

  // set the user albums
  const updateStars = (e) => setStarSelect(e.target.value);

  // handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // error handling for when a user tries to submit a comment if not logged in
    if (!user || user === null) {
      alert("Please log in or create an account to post comments.");
      // erase the comment body
      revert();
    }
    const newReview = {
      exp_id: expId,
      user_id: user.id,
      stars: parseInt(starSelect),
      review_body: body,
    };
    // send review body and exp id to createreview thunk
    let review = await dispatch(createOneReview(newReview, expId));
    // if successful, post the review
    if (review) {
      revert();
      history.push(`/experiences/${expId}`);
    }
  };

  return (
    <div className="">
      <form className="create-comment-form" onSubmit={handleSubmit}>
        <input
          type="body"
          placeholder="Write a comment"
          value={body}
          required // simple error handling for when a user tries to post a comment without a body
          onChange={(e) => setBody(e.target.value)}
        />
        <select
          className="star-rating"
          onChange={updateStars}
          value={starSelect}
          placeholder="Stars"
          required
        >
          <option value="" disabled selected>
            Star rating...
          </option>
          {numStars.map((star) => (
            <option key={star}>{star}</option>
          ))}
        </select>
        <button className="new-comment" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateReview;
