import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneExperience } from "../../store/experiences.js";
import AvailableTimes from "../timeSlots/AvailableTimes.js";
import DeleteExpImg from "../images/DeleteExpImage.js";
import AllImages from "../images/AllImages.js";
import GetReviews2 from "../reviews/GetReviews2.js";
import ExpImages2 from "../images/ExpImage2.js";
import { Modal } from "../../context/Modal";
import { useSubmitted } from "../../context/SubmittedContext.js";
import "./ExpDetails.css";
import Map from "../map/Map.js";

const ExperienceDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let { expId } = useParams();
  expId = parseInt(expId);

  const [showModal, setShowModal] = useState(false);
  const { submitted, setSubmitted } = useSubmitted();

  useEffect(() => {
    dispatch(getOneExperience(expId));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(getOneExperience(expId));
    };
  }, []);

  useEffect(() => {
    if (submitted && showModal) setShowModal(false);
  }, [submitted]);

  const exp = useSelector((state) => state.experiences.oneExperience);
  const user = useSelector((state) => state.session.user);
  const expImgArr = exp["images"];

  // TODO: get avg stars
  const getAvgStars = (exp) => {};

  if (!exp?.id) return null;

  return (
    <div className="details-container">
      <br />
      <br />
      <div className="details-title">{exp?.name}</div>
      <div className="details-subtitle">
        <div className="stars">{getAvgStars(exp)}</div>
        <div className="location">
          {exp?.city}, {exp?.state}, {exp?.country}
        </div>
      </div>
      <div className="details-images">
        <div className="pic-1">
          {/* display default image for other users if no photos */}
          {expImgArr.length === 0 && user?.id !== exp.host_id && (
            <>
              <img
                alt="default"
                src={"../../assets/default-image-localXP.png"}
              ></img>
            </>
          )}
          {/* if there is at least one photo */}
          {expImgArr.length >= 1 && (
            <>
              <img
                className={expImgArr.length === 1 ? "img1" : "pic-1"}
                alt="img1"
                onError={(e) => {
                  e.target.src = "../../assets/default-image-localXP.png";
                }}
                src={expImgArr[0].image_url}
              ></img>
              {user?.id === exp.host_id && (
                <DeleteExpImg imgId={expImgArr[0].id} />
              )}
            </>
          )}
          {/* if the user is the host and there are no photos */}
          {expImgArr.length === 0 && user?.id === exp.host_id && (
            <i
              className="pic1 fa fa-plus"
              // onClick={(e) => history.push(`/experiences/${expId}/edit`)}
              onClick={() => {
                if (!user) return alert("You must be logged in first.");
                setShowModal(true);
                setSubmitted(false);
              }}
            ></i>
          )}
        </div>
        <div className="pic2">
          {/* if there are at least two photos */}
          {expImgArr.length >= 2 && (
            <>
              <img
                className={expImgArr?.length === 2 ? "pic5" : "pic2"}
                alt="img2"
                onError={(e) => {
                  e.target.src = "../../assets/default-image-localXP.png";
                }}
                src={expImgArr[1].image_url}
              ></img>
              {user?.id === exp.host_id && (
                <DeleteExpImg imgId={expImgArr[1].id} />
              )}
            </>
          )}
          {/* if the user is the host and there are not 2 photos */}
          {!expImgArr[1] && user?.id === exp.host_id && (
            <i
              className="pic-2 fa fa-plus"
              // onClick={(e) => history.push(`/experiences/${expId}/edit`)}
              onClick={() => {
                if (!user) return alert("You must be logged in first.");
                setShowModal(true);
                setSubmitted(false);
              }}
            ></i>
          )}
        </div>
        {/* if there are 4 photos */}
        {expImgArr.length === 4 && (
          <div className="img3-img4">
            {expImgArr.length >= 3 && (
              <div className="pic3">
                <img
                  className="pic-3"
                  alt="img3"
                  onError={(e) => {
                    e.target.src = "../../assets/default-image-localXP.png";
                  }}
                  src={expImgArr[2].image_url}
                ></img>
                {user?.id === exp.host_id && (
                  <DeleteExpImg imgId={expImgArr[2].id} />
                )}
              </div>
            )}
            {/* if there are at least 4 photos */}
            {expImgArr.length >= 4 && (
              <div className="pic4">
                <img
                  className="pic-4"
                  alt="img4"
                  onError={(e) => {
                    e.target.src = "../../assets/default-image-localXP.png";
                  }}
                  src={expImgArr[3].image_url}
                ></img>
                {user?.id === exp.host_id && (
                  <DeleteExpImg imgId={expImgArr[3].id} />
                )}
              </div>
            )}
          </div>
        )}
        {/* if the array length is not 4 */}
        {expImgArr.length !== 4 && (
          <div className={expImgArr.length === 3 ? "img3" : "pic3-pic4"}>
            {expImgArr.length >= 3 && (
              <div className="pic3">
                <img
                  className={expImgArr.length === 3 ? "img3" : "pic-3"}
                  alt="img3"
                  onError={(e) => {
                    e.target.src = "../../assets/default-image-localXP.png";
                  }}
                  src={expImgArr[2].image_url}
                ></img>
                {user?.id === exp.host_id && (
                  <DeleteExpImg imgId={expImgArr[2].id} />
                )}
              </div>
            )}
            {/* if the array length is at least 4 */}
            {expImgArr.length >= 4 && (
              <div className="pic4">
                <img
                  className="pic-4"
                  alt="img4"
                  onError={(e) => {
                    e.target.src = "../../assets/default-image-localXP.png";
                  }}
                  src={expImgArr[3].image_url}
                ></img>
                {user?.id === exp.host_id && (
                  <DeleteExpImg imgId={expImgArr[3].id} />
                )}
              </div>
            )}
            {/* if there is no third photo */}
            {!expImgArr[2] && user?.id === exp.host_id && (
              <i
                className="pic3 fa fa-plus"
                // onClick={(e) => history.push(`/experiences/${expId}/edit`)}
                onClick={() => {
                  if (!user) return alert("You must be logged in first.");
                  setShowModal(true);
                  setSubmitted(false);
                }}
              ></i>
            )}
            {/* {expImgArr[3] && user?.id === exp.host_id && (
              <i
                className="pic4 fa fa-plus"
                onClick={(e) => history.push(`/experiences/${expId}/edit`)}
              ></i>
            )} */}
            {/* if there are less than 3 photos */}
            {expImgArr.length < 3 &&
              !expImgArr[3] &&
              user?.id === exp.host_id && (
                <i
                  className="pic4 fa fa-plus"
                  onClick={() => {
                    if (!user) return alert("You must be logged in first.");
                    setShowModal(true);
                    setSubmitted(false);
                  }}
                  // onClick={(e) => history.push(`/experiences/${expId}/edit`)}
                ></i>
              )}
          </div>
        )}

        <div className="pic5">
          {/* if there are at least 5 photos */}
          {expImgArr.length >= 5 && (
            <>
              <img
                className="pic5"
                alt="img-5"
                onError={(e) => {
                  e.target.src = "../../assets/default-image-localXP.png";
                }}
                src={expImgArr[4].image_url}
              ></img>
              {user?.id === exp.host_id && (
                <DeleteExpImg
                  user={user?.id}
                  exp={exp}
                  imgId={expImgArr[4].id}
                />
              )}
            </>
          )}
          {/* if there is no 5th photo */}
          {!expImgArr[4] && user?.id === exp.host_id && (
            <i
              className={
                expImgArr.length === 3
                  ? "pic-3-pic-4 fa fa-plus"
                  : "pic-5 fa fa-plus"
              }
              onClick={() => {
                if (!user) return alert("You must be logged in first.");
                setShowModal(true);
                setSubmitted(false);
              }}
              // onClick={() => history.push(`/experiences/${expId}/edit`)}
            ></i>
          )}
        </div>
      </div>
      {!submitted && showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <ExpImages2 setShowModal={setShowModal} />
        </Modal>
      )}
      <div>
        <AllImages exp={exp} />
      </div>
      <div className="details">
        <div>Experience hosted by {exp["exp_host"]?.first_name}</div>
        {exp.host_id === user?.id && (
          <div
            className="edit-exp-details"
            onClick={(e) => history.push(`/experiences/${expId}/edit`)}
          >
            Edit experience details
          </div>
        )}
      </div>

      <div className="details-duration">
        {exp?.est_duration === 480
          ? "All day"
          : `${exp?.est_duration / 60} hours`}
      </div>
      <hr></hr>
      <div className="details">What you'll do</div>
      <div className="details-description">{exp?.description}</div>
      <hr></hr>
      <div className="details">Choose from available dates</div>
      <AvailableTimes />
      <hr></hr>
      <Map exp={exp} />
      <GetReviews2 />
      <br />
      <br />
    </div>
  );
};
export default ExperienceDetails;
