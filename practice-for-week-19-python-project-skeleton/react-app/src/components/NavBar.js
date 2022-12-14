import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";
import LoginFormModal from "./auth/LoginFormModal";
import SignupFormModal from "./auth/SignupFormModal";
import UserProfile from "./users/UserProfile";
import { getAllExperiences } from "../store/experiences";
import "../index.css";

const NavBar = ({ loaded }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  const dispatch = useDispatch();
  let sessionLinks;

  useEffect(() => {
    dispatch(getAllExperiences());
  }, []);

  const experiences = useSelector((state) => state.experiences.experiences);

  // open menu onClick event
  const openMenu = () => {
    if (showDropdown) return;
    setShowDropdown(true);
  };

  // close the menu if a user clicks anywhere outside of it
  useEffect(() => {
    if (!showDropdown) return;
    const closeDropdown = () => {
      setShowDropdown(false);
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

  // if a user is logged in
  if (user) {
    sessionLinks = (
      <div className="session-links">
        <div onClick={() => history.push("/experiences")} className="explore">
          Explore
        </div>
        <div className="session">
          <div onClick={() => setShowDropdown(true)} className="hamburger">
            <hr className="bars" />
            <hr className="bars" />
            <hr className="bars" />
          </div>
          <div className="profile">
            <div onClick={() => history.push(`/users/${user?.id}`)}>
              <i className="fa-solid fa-circle-user fa-2x"></i>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // show login and signup buttons if not logged in
    sessionLinks = (
      <div className="login-signup-links">
        <div onClick={() => history.push("/experiences")} className="explore">
          Explore
        </div>
        <LoginFormModal />
        <SignupFormModal />
      </div>
    );
  }

  return (
    <nav>
      <div>
        <div className="logo-search-profile">
          <div className="logo">
            <img
              onClick={() => history.push("/")}
              className="img-logo"
              alt="logo"
              src="../../assets/localXP-logo.jpg"
            />
          </div>
          <div className="profile-dropdown">
            {sessionLinks}

            {showDropdown && (
              <div className="show-dropdown">
                <div
                  onClick={() => history.push("/experiences/new")}
                  className="create-exp"
                >
                  Host an experience
                </div>
                <div className="logout">
                  <LogoutButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <hr className="navbar"></hr>
    </nav>
  );
};

export default NavBar;
