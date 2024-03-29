import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import { authenticate } from "./store/session";
import ExploreExperiences from "./components/experiences/ExploreExp";
import ExperienceDetails from "./components/experiences/ExpDetails";
import ExpTimeSlots from "./components/experiences/ExpTimeSlots";
import NewExperience from "./components/experiences/NewExperience";
import UserProfile from "./components/users/UserProfile";
import UpdateExp from "./components/experiences/UpdateExp";
import { getAllExperiences } from "./store/experiences";
import DeleteExperience from "./components/experiences/DeleteExp";
import LandingPage from "./components/LandingPage";
import NotFoundPage from "./components/NotFoundPage";
import UploadReviewImage from "./components/images/RvwImageAWS";
import ExploreExperienceResults from "./components/experiences/ExploreExperienceResults";
import UserExperiences from "./components/users/UserExperiences";
import UserBookings from "./components/users/UserBookings";
import Map from "./components/map/Map";

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllExperiences());
  }, [loaded, dispatch]);

  const experiences = useSelector((state) => state.experiences.experiences);
  const expArr = Object.values(experiences);

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  document.querySelectorAll("iframe").forEach(function (elem) {
    elem.parentNode.removeChild(elem);
  });

  return (
    <BrowserRouter>
      <NavBar loaded={loaded} />
      <Switch>
        <Route path="/login" exact={true}>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm />
        </Route>
        <Route path="/experiences" exact={true}>
          <ExploreExperiences loaded={loaded} expArr={expArr} />
        </Route>
        <Route path="/experiences/results" exact={true}>
          <ExploreExperienceResults loaded={loaded} expArr={expArr} />
        </Route>
        <Route path="/experiences/new" exact={true}>
          <NewExperience />
        </Route>
        <Route path="/experiences/:expId" exact={true}>
          <ExperienceDetails />
        </Route>
        <Route path="/experiences/:expId/edit" exact={true}>
          <UpdateExp />
        </Route>
        <Route path="/experiences/:expId/delete" exact={true}>
          <DeleteExperience />
        </Route>
        <Route path="/experiences/:expId/dates" exact={true}>
          <ExpTimeSlots />
        </Route>
        <Route path="/users/:userId" exact={true}>
          <UserProfile />
        </Route>
        <Route path="/users/:userId/experiences" exact={true}>
          <UserExperiences />
        </Route>
        <Route path="/users/:userId/bookings" exact={true}>
          <UserBookings />
        </Route>
        <Route path="/experiences/:expId/reviews/:rvwId/upload" exact={true}>
          <UploadReviewImage />
        </Route>
        <Route path="/map">
          <Map />
        </Route>
        <Route path="/" exact={true}>
          <LandingPage />
        </Route>
        <Route path="">
          <NotFoundPage />
        </Route>
      </Switch>
      <footer>
        Aribnb clone by Joanna Gilbert
        <Link
          to={{
            pathname: "https://github.com/jcgilb",
          }}
          target="_blank"
        >
          <img
            className="about-me github"
            alt="linkedin"
            src="../assets/github-icon.png"
          ></img>
        </Link>
        <Link
          to={{
            pathname: "https://www.linkedin.com/in/joanna-gilbert-7b2053255/",
          }}
          target="_blank"
        >
          <img
            className="about-me linkedin"
            alt="linkedin"
            src="../assets/linkedin-icon.png"
          ></img>
        </Link>
      </footer>
    </BrowserRouter>
  );
}

export default App;
