import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../store/session";
import "./Login.css";

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="modal-container">
      <form className="modal-form" onSubmit={onLogin}>
        <div className="input-container">
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <label htmlFor="email">Email</label>
          <input
            className="modal-input"
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={updateEmail}
          />

          <label htmlFor="password">Password</label>
          <input
            className="modal-input"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={updatePassword}
          />

          <button className="login-logout" type="submit">
            Login
          </button>
          <button
            className="login-logout"
            type="submit"
            onClick={() => {
              setEmail("demo@aa.io");
              setPassword("password");
            }}
          >
            Demo User
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
