import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneExperience } from "../../store/experiences";
import { deleteSlot, getAllSlots } from "../../store/timeSlots";

const DeleteTimeSlot = ({ slotId }) => {
  let { expId } = useParams();
  expId = parseInt(expId);

  const dispatch = useDispatch();
  const history = useHistory();
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    dispatch(getAllSlots(expId));
    return () => {
      dispatch(getAllSlots(expId));
    };
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
    await dispatch(deleteSlot(expId, slotId));
    dispatch(getOneExperience(expId));
    history.push(`/experiences/${expId}`);
  };

  return (
    <>
      <i
        class="fa-regular fa-trash-can"
        onClick={() => setShowDelete(true)}
      ></i>
      {showDelete && <div onClick={handleClick}>Delete this time slot</div>}
    </>
  );
};

export default DeleteTimeSlot;
