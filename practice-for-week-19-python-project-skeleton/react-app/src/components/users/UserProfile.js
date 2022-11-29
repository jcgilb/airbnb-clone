import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getAllBookings, getUserBookings } from "../../store/bookings";
import { getAllExperiences, getUserExperiences } from "../../store/experiences";
import DeleteBooking from "../bookings/DeleteBooking";
import "./UserProfile.css";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  let { userId } = useParams();
  const history = useHistory();
  userId = parseInt(userId);

  useEffect(() => {
    dispatch(getUserBookings(userId));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUserExperiences(userId));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllExperiences());
  }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/");
      const responseData = await response.json();
      setUsers(responseData.users);
    }
    fetchData();
  }, []);

  const bookings = useSelector((state) => state.bookings.userBookings);
  const experiences = useSelector((state) => state.experiences.userExperiences);
  const oneUser = users.find((person) => person.id === parseInt(userId));
  const allExps = useSelector((state) => state.experiences.experiences);
  const user = useSelector((state) => state.session.user);
  const expArray = Object.values(experiences);
  const bkgArray = Object.values(bookings);
  const allExpArr = Object.values(allExps);

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
        <div>{oneExp?.name}</div>
        <div>
          {week}, {monthDay}, {year} at {start}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="container">
        {user.id === userId && (
          <>
            <div className="title">Welcome, {user?.first_name}</div>
          </>
        )}
        {user.id !== userId && (
          <>
            <div className="title">{oneUser?.first_name}'s Profile</div>
          </>
        )}

        <div className="inner-container">
          <div className="list">
            <div className="title">All Experiences:</div>
            {expArray.map((exp) => (
              <>
                <li key={exp.id}>
                  <div onClick={(e) => history.push(`/experiences/${exp.id}`)}>
                    <div>{exp.name}</div>
                    <div>
                      {exp.city}, {exp.state}, {exp.country}
                    </div>
                  </div>
                </li>
              </>
            ))}
          </div>
          <div className="list">
            <div className="title">All Bookings:</div>
            {bkgArray.map((bkg) => (
              <>
                <li key={bkg.id}>{bookingInfo(bkg)}</li>
                {user?.id === userId && (
                  <DeleteBooking userId={userId} user={user} bkgId={bkg.id} />
                )}
              </>
            ))}
          </div>
          <div className="user-info">
            <div className="user-image"></div>
            <div className="user-details">
              {user?.id === userId ? user?.first_name : oneUser?.first_name}{" "}
              {user?.id === userId ? user?.last_name : oneUser?.last_name}{" "}
            </div>
            <div>
              Total EXP:{" "}
              {user?.id === userId ? user?.total_exp : oneUser?.total_exp}
            </div>
            <div>Badges: {""}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserProfile;
