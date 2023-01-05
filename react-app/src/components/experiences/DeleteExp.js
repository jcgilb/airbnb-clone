import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  deleteExperience,
  getAllExperiences,
} from "../../store/experiences.js";
import "./DeleteExp.css";

const DeleteExperience = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showDelete, setShowDelete] = useState(false);

  // identify the experience from the url
  let { expId } = useParams();
  expId = parseInt(expId);

  // get experiences
  useEffect(() => {
    dispatch(getAllExperiences());
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
    await dispatch(deleteExperience(expId));
    return history.push(`/experiences`);
  };

  return (
    <div className="delete-rvw-container">
      <i
        className="exp-trash fa-regular fa-trash-can"
        onClick={() => setShowDelete(true)}
      ></i>
      {showDelete && (
        <div className="confirm-delete-exp" onClick={handleClick}>
          Delete this experience
        </div>
      )}
    </div>
  );
};

export default DeleteExperience;
