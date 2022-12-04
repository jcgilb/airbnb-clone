import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const experiences = useSelector((state) => state.experiences.experiences);

  // get experiences
  useEffect(() => {
    dispatch(getAllExperiences());
  }, [dispatch]);

  // open menu onClick event
  const openMenu = () => {
    if (showDelete) return;
    setShowDelete(true);
  };

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
    <>
      <i
        className="exp-trash fa-regular fa-trash-can"
        onClick={() => setShowDelete(true)}
      ></i>
      {showDelete && (
        <div className="confirm-delete-exp" onClick={handleClick}>
          Delete this experience
        </div>
      )}
    </>
  );
};

export default DeleteExperience;
