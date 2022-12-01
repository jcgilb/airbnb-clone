import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
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

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllExperiences());
  }, [loaded]);

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
        <Route path="/" exact={true}>
          <LandingPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
