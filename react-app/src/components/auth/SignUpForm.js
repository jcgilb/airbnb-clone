import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  // form validations
  useEffect(() => {
    const errors = [];
    setValidationErrors(errors);
    if (password !== repeatPassword) errors.push("Passwords do not match.");
    if (username.length < 4 || username.length > 20)
      errors.push("Username must be 4-20 characters.");
    setValidationErrors(errors);
  }, [password, repeatPassword, username]);

  const onSignUp = async (e) => {
    e.preventDefault();
    setErrors([]);
    if (password === repeatPassword) {
      const data = await dispatch(
        signUp(username, firstName, lastName, email, password)
      );
      if (data) {
        setErrors(data);
      }
    }
  };
  const updateFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const updateLastName = (e) => {
    setLastName(e.target.value);
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="modal-container">
      <form className="modal-form" onSubmit={onSignUp}>
        <div>
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
          {validationErrors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        <div>
          <label>First Name</label>
          <input
            className="modal-input"
            type="text"
            name="firstName"
            onChange={updateFirstName}
            value={firstName}
            required={true}
          ></input>
        </div>
        <div>
          <label>Last Name</label>
          <input
            className="modal-input"
            type="text"
            name="lastName"
            onChange={updateLastName}
            value={lastName}
            required={true}
          ></input>
        </div>
        <div>
          <label>Username</label>
          <input
            className="modal-input"
            type="text"
            name="username"
            onChange={updateUsername}
            value={username}
            required={true}
          ></input>
        </div>
        <div>
          <label>Email</label>
          <input
            className="modal-input"
            type="text"
            name="email"
            onChange={updateEmail}
            value={email}
          ></input>
        </div>
        <div>
          <label>Password</label>
          <input
            className="modal-input"
            type="password"
            name="password"
            onChange={updatePassword}
            value={password}
          ></input>
        </div>
        <div>
          <label>Repeat Password</label>
          <input
            className="modal-input"
            type="password"
            name="repeat_password"
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}
          ></input>
        </div>
        <button
          disabled={!!validationErrors.length}
          className="login-logout"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
