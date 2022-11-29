import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneExperience } from "../../store/experiences.js";
import { deleteExpImage } from "../../store/images.js";
import User from "../User.js";
import "./DeleteImage.css";

const DeleteExpImg = ({ imgId, user, exp }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showDelete, setShowDelete] = useState(false);

  // identify the experience from the url
  let { expId } = useParams();
  expId = parseInt(expId);
  imgId = parseInt(imgId);

  const experiences = useSelector((state) => state.experiences.experiences);

  // // get experiences
  // useEffect(() => {
  //   dispatch(getAllExperiences());
  // }, [dispatch]);

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
    console.log(expId, imgId, "expid, imgId");
    await dispatch(deleteExpImage(expId, imgId));
    dispatch(getOneExperience(expId));
    return history.push(`/experiences/${expId}`);
  };

  return (
    <>
      <i className="fa-solid fa-x" onClick={() => setShowDelete(true)}></i>
      {showDelete && <div onClick={handleClick}>Delete image</div>}
    </>
  );
};

export default DeleteExpImg;
