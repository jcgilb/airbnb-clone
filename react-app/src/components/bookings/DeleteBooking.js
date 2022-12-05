import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteBooking, getUserBookings } from "../../store/bookings.js";

const DeleteBooking = ({ bkgId, user, userId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showDelete, setShowDelete] = useState(false);

  // close the menu if a user clicks anywhere outside of it
  useEffect(() => {
    if (!showDelete) return;
    const closeDelete = () => {
      setShowDelete(false);
    };
    document.addEventListener("click", closeDelete);
    return () => document.removeEventListener("click", closeDelete);
  }, [showDelete]);

  // onClick, delete the song from the url
  const handleClick = async (e) => {
    e.preventDefault();
    if (userId === user.id) {
      await dispatch(deleteBooking(bkgId));
      dispatch(getUserBookings(userId));
    }
    return history.push(`/users/${userId}`);
  };

  return (
    <>
      <i
        class="fa-regular fa-trash-can"
        onClick={() => setShowDelete(true)}
      ></i>
      {showDelete && (
        <div className="confirm-delete-bkg" onClick={handleClick}>
          Cancel this booking
        </div>
      )}
    </>
  );
};

export default DeleteBooking;
