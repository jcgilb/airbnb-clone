import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getUserBookings } from "../../store/bookings";
import { getAllExperiences, getUserExperiences } from "../../store/experiences";
import DeleteBooking from "../bookings/DeleteBooking";
import UserExperiences from "./UserExperiences";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
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
  const oneUser = users.find((person) => person?.id === parseInt(userId));
  const allExps = useSelector((state) => state.experiences.experiences);
  const user = useSelector((state) => state.session.user);
  const expArray = Object.values(experiences);
  const bkgArray = Object.values(bookings);
  const allExpArr = Object.values(allExps);

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

  const getExpDetails = (id) => {
    history.push(`/experiences/${id}`);
  };

  return (
    <>
      <div className="container">
        <div className="container-inner">
          {user?.id === userId && (
            <>
              <br />
              <br />
              <div className="profile-title">Welcome, {user?.first_name}</div>
              <br />
            </>
          )}
          {user?.id !== userId && (
            <>
              <br />
              <br />
              <div className="profile-title">
                {oneUser?.first_name}'s Profile
              </div>
              <br />
            </>
          )}

          <div className="inner-container">
            <div className="user-info">
              <div className="title"></div>
              <div className="user-image"></div>
              <div className="user-details">
                {user?.id === userId ? user?.first_name : oneUser?.first_name}{" "}
                {user?.id === userId ? user?.last_name : oneUser?.last_name}{" "}
              </div>
              <div>
                Total XP:{" "}
                {user?.id === userId ? user?.total_exp : oneUser?.total_exp}
              </div>
              <div>Badges: {""}</div>
            </div>
            <div className="list-exp">
              <div className="title">Experiences</div>
              <Carousel infiniteLoop>
                {expArray?.map((exp) => (
                  <div className="carousel-exp-card">
                    <div
                      className="carousel-explore-card"
                      key={"image"}
                      onClick={() => getExpDetails(exp.id)}
                    >
                      {getFirstImage(exp)}
                    </div>
                    <div
                      className="explore-card"
                      key={exp.id}
                      onClick={() => getExpDetails(exp.id)}
                    >
                      {exp?.name}
                    </div>
                    <div
                      className="explore-card"
                      key={exp.price}
                      onClick={() => getExpDetails(exp.id)}
                    >
                      {"Price: $"}
                      {exp?.price}/person
                    </div>
                    <br />
                  </div>
                ))}
                {/* {expArray.map((exp) => (
                  <>
                    <li key={exp.id}>
                      <div
                        className="exp-list-profile"
                        onClick={(e) => history.push(`/experiences/${exp.id}`)}
                      >
                        <div>
                          <div className="exp-name-profile">{exp.name}</div>
                          <div className="exp-location-profile">
                            {exp.city}, {exp.state}, {exp.country}
                          </div>
                        </div>
                      </div>
                    </li>
                  </>
                ))} */}
              </Carousel>
            </div>
            <br />
            <div className="list-bkg">
              <div className="title">Bookings</div>
              {bkgArray.map((bkg) => (
                <div className="profile-delete-bkg-profile">
                  <li key={bkg.id}>{bookingInfo(bkg)}</li>
                  {user?.id === userId && (
                    <div className="delete-bkg">
                      <DeleteBooking
                        userId={userId}
                        user={user}
                        bkgId={bkg.id}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <br />
          <br />
        </div>
      </div>
    </>
  );
};
export default UserProfile;
