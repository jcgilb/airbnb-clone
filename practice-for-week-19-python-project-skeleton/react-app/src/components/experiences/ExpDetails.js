import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";

import {
  getAllExperiences,
  getOneExperience,
} from "../../store/experiences.js";
import "./ExpDetails.css";
import AvailableTimes from "../timeSlots/AvailableTimes.js";
import UpdateExp from "./UpdateExp.js";
import User from "../User.js";

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
  let imgPlaces = new Array(5);

  const getAvgStars = (exp) => {};

  if (!exp?.id) return null;

  return (
    <div>
      <div className="details-title">{exp?.name}</div>
      <div className="details-subtitle">
        <div className="stars">{getAvgStars(exp)}</div>
        <div className="location">
          {exp?.city}, {exp?.state}, {exp?.country}
        </div>
      </div>
      <div className="details-images">
        {expImgArr.length >= 1 && (
          <img className="pic1" alt="img" src={expImgArr[0].image_url}></img>
        )}
        {expImgArr.length >= 2 && (
          <img className="pic2" alt="img" src={expImgArr[1].image_url}></img>
        )}
        <div className="pic3-pic4">
          {expImgArr.length >= 3 && (
            <img className="pic3" alt="img" src={expImgArr[2].image_url}></img>
          )}
          {expImgArr.length >= 4 && (
            <img className="pic4" alt="img" src={expImgArr[3].image_url}></img>
          )}
        </div>
        {expImgArr.length >= 5 && (
          <img className="pic5" alt="img" src={expImgArr[4].image_url}></img>
        )}

        {expImgArr.length === 0 && user.id === exp.host_id && (
          <i
            className="pic1 fa fa-plus"
            onClick={(e) => history.push(`/experiences/${expId}/edit`)}
            aria-hidden="true"
          ></i>
        )}
        {!expImgArr[1] && user.id === exp.host_id && (
          <i
            className="pic2 fa fa-plus"
            onClick={(e) => history.push(`/experiences/${expId}/edit`)}
            aria-hidden="true"
          ></i>
        )}
        <div className="pic3-pic4">
          {!expImgArr[2] && user.id === exp.host_id && (
            <i
              className="pic3 fa fa-plus"
              onClick={(e) => history.push(`/experiences/${expId}/edit`)}
              aria-hidden="true"
            ></i>
          )}
          {!expImgArr[3] && user.id === exp.host_id && (
            <i
              className="pic4 fa fa-plus"
              onClick={(e) => history.push(`/experiences/${expId}/edit`)}
              aria-hidden="true"
            ></i>
          )}
        </div>
        {!expImgArr[4] && user.id === exp.host_id && (
          <i
            className="pic5 fa fa-plus"
            aria-hidden="true"
            onClick={() => history.push(`/experiences/${expId}/edit`)}
          ></i>
        )}
      </div>
      <div className="details">
        <div>Experience hosted by {exp["exp_host"]?.first_name}</div>
        {exp.host_id === user.id && (
          <div onClick={(e) => history.push(`/experiences/${expId}/edit`)}>
            Edit experience details
          </div>
        )}
      </div>

      <div className="details-duration">{exp?.est_duration / 60} hours</div>
      <hr></hr>
      <div className="details">What you'll do</div>
      <div className="details-description">{exp?.description}</div>
      <hr></hr>
      <div className="details">Choose from available dates</div>
      <AvailableTimes />
    </div>
  );
};
export default ExperienceDetails;
