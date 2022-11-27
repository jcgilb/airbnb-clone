import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  deleteExperience,
  getAllExperiences,
} from "../../store/experiences.js";

const DeleteExperience = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // identify the song from the url
  let { expId } = useParams();
  expId = parseInt(expId);

  const experiences = useSelector((state) => state.experiences);

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

  if (!Object.values(experiences).length) return null;

  return (
    <>
      <i class="fa-regular fa-trash-can" onClick={handleClick}></i>
    </>
  );
};

export default DeleteExperience;
