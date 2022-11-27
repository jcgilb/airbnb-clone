import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  return (
    <>
      <div className="container">
        <div className="title">My Bookings</div>
        <div className="inner-container">
          <div className="list"></div>
          <div className="user-info"></div>
        </div>
      </div>
    </>
  );
};
export default UserProfile;
