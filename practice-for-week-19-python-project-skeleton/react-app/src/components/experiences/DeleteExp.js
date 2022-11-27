import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  deleteExperience,
  getAllExperiences,
} from "../../store/experiences.js";

const DeleteExperience = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showDelete, setShowDelete] = useState(false);

  // identify the song from the url
  let { expId } = useParams();
  expId = parseInt(expId);

  const experiences = useSelector((state) => state.experiences.experiences);

  // get songs
  useEffect(() => {
    dispatch(getAllExperiences());
  }, [dispatch]);

  // onClick, delete the song from the url
  const handleClick = async (e) => {
    e.preventDefault();
    await dispatch(deleteExperience(expId));
    return history.push(`/experiences`);
  };

  return (
    <>
      <i
        class="fa-regular fa-trash-can"
        onClick={() => setShowDelete(true)}
      ></i>
      {showDelete && <div onClick={handleClick}>Delete this experience</div>}
    </>
  );
};

export default DeleteExperience;
