import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";
import LoginFormModal from "./auth/LoginFormModal";
import SignupFormModal from "./auth/SignupFormModal";
import UserProfile from "./users/UserProfile";

const NavBar = ({ loaded }) => {
  const user = useSelector((state) => state.session.user);
  const history = useHistory();
  let sessionLinks;

  // if a user is logged in
  if (user) {
    sessionLinks = (
      <div className="session-links">
        <div id="logged-in-links">
          {/* TODO: <ProfileButton user={user} /> */}
          <NavLink className="profile" exact to={`/users/${user?.id}`}>
            User profile
          </NavLink>
          <NavLink className="create-exp" exact to="/experiences/new">
            Host an experience
          </NavLink>

          <div className="logout">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  } else {
    // show login and signup buttons if not logged in
    sessionLinks = (
      <div className="login-signup-links">
        <LoginFormModal />
        {/* <div id="login">Login</div> */}
        <SignupFormModal />
        {/* <div id="signup">Signup</div> */}
      </div>
    );
  }

  return (
    <nav>
      <div>
        <div>
          <NavLink to="/" exact={true} activeClassName="active">
            {/* TODO: Logo here */}
            Home
          </NavLink>
          <NavLink className="explore" exact to="/experiences">
            Explore
          </NavLink>
        </div>
        <div className="profile-dropdown">{sessionLinks}</div>
      </div>
    </nav>
  );
};

export default NavBar;
