import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getUserBookings } from "../../store/bookings";
import { getUserExperiences } from "../../store/experiences";
import DeleteBooking from "../bookings/DeleteBooking";

const UserBookings = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let { userId } = useParams();
  userId = parseInt(userId);

  // TODO: cancel bookings if date is in the past

  useEffect(() => {
    dispatch(getUserBookings(userId));
    dispatch(getUserExperiences(userId));
  }, [dispatch]);

  const user = useSelector((state) => state.session.user);
  const experiences = useSelector((state) => state.experiences.experiences);
  const allExpArr = Object.values(experiences);
  const bookings = useSelector((state) => state.bookings.userBookings);
  const bkgArray = Object.values(bookings);

  const bookingInfo = (bkg) => {
    let oneExp = allExpArr?.find((exp) => exp.id === bkg.exp_id);
    let timeSlot;
    if (oneExp) {
      timeSlot = oneExp["time_slots"]?.find(
        (slot) => slot.id === bkg.time_slot_id
      );
    }
    let date = String(new Date(parseInt(timeSlot?.start)));
    let week = date.slice(0, 3);
    let year = date.slice(11, 15);
    let start = date.slice(16, 18);
    let monthDay = date.slice(4, 10);
    if (parseInt(start) < 12) start = start.concat("AM");
    if (parseInt(start) === 12) start = start.concat("PM");
    if (parseInt(start) > 12) start = String(parseInt(start) - 12).concat("PM");
    return (
      <div onClick={(e) => history.push(`/experiences/${oneExp?.id}`)}>
        <div className="exp-name-profile">{oneExp?.name}</div>
        <div className="exp-date-profile">
          {week}, {monthDay}, {year} at {start}
        </div>
      </div>
    );
  };

  const getFirstImage = (exp) => {
    let image;
    if (exp["images"]?.length) {
      image = exp["images"][0];
    }
    return (
      <img
        onError={(e) => {
          e.target.src = "../../assets/default-image-localXP.png";
        }}
        className="experience-img"
        alt={exp.id}
        src={
          !image?.image_url
            ? "../../../assets/default-image-localXP.png"
            : image?.image_url
        }
      ></img>
    );
  };

  const getExpDetails = (id) => {
    history.push(`/experiences/${id}`);
  };

  // const getAvgStars = (exp) => {
  //   // TODO: get avg star rating
  //   // TODO: get total num reviews
  // };

  if (!bkgArray.length) {
    return (
      <div className="search-results-container">
        <div className="container">
          <br></br>
          <br></br>
          <div className="explore-title">{"No Bookings (yet)"}</div>
          <div
            onClick={() => history.push("/experiences")}
            className="top create-exp"
          >
            Explore experiences
          </div>
          <br></br>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="container">
        <br></br>
        <br></br>
        <div className="explore-title">{"My Bookings"}</div>
        <br></br>

        <div className="flex-row-wrap">
          {bkgArray.map((bkg) => (
            <div className="delete-bkg-profile">
              <li key={bkg.id}>{bookingInfo(bkg)}</li>
              {user?.id === userId && (
                <div className="delete-bkg">
                  <DeleteBooking userId={userId} user={user} bkgId={bkg.id} />
                </div>
              )}
            </div>
          ))}
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};
export default UserBookings;
