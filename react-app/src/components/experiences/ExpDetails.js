import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneExperience } from "../../store/experiences.js";
import "./ExpDetails.css";
import AvailableTimes from "../timeSlots/AvailableTimes.js";
import DeleteExpImg from "../images/DeleteExpImage.js";

const ExperienceDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let { expId } = useParams();
  expId = parseInt(expId);

  useEffect(() => {
    dispatch(getOneExperience(expId));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(getOneExperience());
    };
  }, []);

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
        <div className="pic1">
          {expImgArr.length >= 1 && (
            <>
              <img
                className="pic-1"
                alt="img1"
                onError={(e) => {
                  e.target.src = "../../assets/default-image-localXP.jpg";
                }}
                src={expImgArr[0].image_url}
              ></img>
              {user?.id === exp.host_id && (
                <DeleteExpImg imgId={expImgArr[0].id} />
              )}
            </>
          )}
          {expImgArr.length === 0 && user?.id === exp.host_id && (
            <i
              className="pic1 fa fa-plus"
              style={{
                border: "1px solid rgb(221, 237, 170)",
                height: "400px",
                marginLeft: "8px",
                width: "291px",
                padding: "none",
                marginTop: "16px",
                marginLeft: "8px",
                marginRight: "16px",
              }}
              onClick={(e) => history.push(`/experiences/${expId}/edit`)}
              aria-hidden="true"
            ></i>
          )}
        </div>
        <div className="pic2">
          {expImgArr.length >= 2 && (
            <>
              <img
                className="pic-2"
                alt="img2"
                onError={(e) => {
                  e.target.src = "../../assets/default-image-localXP.jpg";
                }}
                src={expImgArr[1].image_url}
              ></img>
              {user?.id === exp.host_id && (
                <DeleteExpImg imgId={expImgArr[1].id} />
              )}
            </>
          )}
          {!expImgArr[1] && user?.id === exp.host_id && (
            <i
              className="pic2 fa fa-plus"
              style={{
                border: "1px solid rgb(221, 237, 170)",
                height: "400px",
                width: "291px",
                padding: "none",
                marginTop: "8px",
                marginLeft: "8px",
                marginRight: "16px",
              }}
              onClick={(e) => history.push(`/experiences/${expId}/edit`)}
              aria-hidden="true"
            ></i>
          )}
        </div>
        <div className="pic3-pic4">
          {expImgArr.length >= 3 && (
            <div className="pic3">
              <img
                className="pic-3"
                alt="img3"
                src={expImgArr[2].image_url}
              ></img>
              {user?.id === exp.host_id && (
                <DeleteExpImg imgId={expImgArr[2].id} />
              )}
            </div>
          )}
          {expImgArr.length >= 4 && (
            <div className="pic4">
              <img
                className="pic-4"
                alt="img4"
                src={expImgArr[3].image_url}
              ></img>
              {user?.id === exp.host_id && (
                <DeleteExpImg imgId={expImgArr[3].id} />
              )}
            </div>
          )}
          {!expImgArr[2] && user?.id === exp.host_id && (
            <i
              className="pic-3 fa fa-plus"
              style={{
                border: "1px solid rgb(221, 237, 170)",
                marginLeft: "16px",
                marginTop: "16px",
                marginBottom: "8px",
                marginLeft: "16px",
                height: "184px",
                width: "128px",
              }}
              onClick={(e) => history.push(`/experiences/${expId}/edit`)}
              aria-hidden="true"
            ></i>
          )}
          {!expImgArr[3] && user?.id === exp.host_id && (
            <i
              className="pic-4 fa fa-plus"
              style={{
                border: "1px solid rgb(221, 237, 170)",
                marginTop: "8px",
                marginLeft: "16px",
                height: "183px",
                width: "128px",
              }}
              onClick={(e) => history.push(`/experiences/${expId}/edit`)}
              aria-hidden="true"
            ></i>
          )}
        </div>
        <div className="pic5">
          {expImgArr.length >= 5 && (
            <>
              <img
                className="pic-5"
                alt="img5"
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
          {!expImgArr[4] && user?.id === exp.host_id && (
            <i
              className="pic5 fa fa-plus"
              aria-hidden="true"
              style={{
                border: "1px solid rgb(221, 237, 170)",
                padding: "none",
                marginTop: "8px",
                marginLeft: "8px",
                height: "400px",
                width: "291px",
              }}
              onClick={() => history.push(`/experiences/${expId}/edit`)}
            ></i>
          )}
        </div>
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
        {exp?.est_duration === 60
          ? "All day"
          : `${exp?.est_duration / 60} hours`}
      </div>
      <hr></hr>
      <div className="details">What you'll do</div>
      <div className="details-description">{exp?.description}</div>
      <hr></hr>
      <div className="details">Choose from available dates</div>
      <AvailableTimes />
      <br />
      <br />
    </div>
  );
};
export default ExperienceDetails;
