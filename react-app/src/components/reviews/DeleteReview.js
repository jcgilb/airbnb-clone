import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneExperience } from "../../store/experiences.js";
import { deleteReview, getAllReviews } from "../../store/reviews.js";
import "./DeleteReview.css";

const DeleteReview = ({ rvw }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showDelete, setShowDelete] = useState(false);

  // identify the experience from the url
  let { expId } = useParams();
  expId = parseInt(expId);

  // get reviews
  useEffect(() => {
    dispatch(getAllReviews(expId));
    return () => {
      dispatch(getAllReviews(expId));
    };
  }, [dispatch]);

  // close the menu if a user clicks anywhere outside of it
  useEffect(() => {
    if (!showDelete) return;
    const closeDelete = () => {
      setShowDelete(false);
    };
    document.addEventListener("click", closeDelete);
    return () => document.removeEventListener("click", closeDelete);
  }, [showDelete]);

  // onClick, delete the experience from the url
  const handleClick = async (e) => {
    e.preventDefault();
    await dispatch(deleteReview(expId, rvw.id));
    await dispatch(getAllReviews(expId));
    return history.push(`/experiences/${expId}`);
  };

  return (
    <>
      <i
        className="review fa-regular fa-trash-can"
        // onClick={handleClick}
        onClick={() => setShowDelete(true)}
      ></i>
      {showDelete && (
        <div className="rvw-confirm-delete" onClick={handleClick}>
          Delete review
        </div>
      )}
    </>
  );
};

export default DeleteReview;
