import React, { useEffect, useState } from "react";
import { useDeferredValue } from "react";
import DateTimePicker from "react-datetime-picker";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUserExperiences, getOneExperience } from "../../store/experiences";

import { getAllSlots, createOneSlot } from "../../store/timeSlots";
import "./ExpTimeSlots.css";

const ExpTimeSlots = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState();
  const [expId, setExpId] = useState(null);
  const [timeSlot, setTimeSlot] = useState();
  const [now, setNow] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [expSelect, setExpSelect] = useState();
  const [start, setStart] = useState(new Date());
  const [duration, setDuration] = useState();

  // get the user
  const user = useSelector((state) => state.session.user);

  // get user's experiences
  useEffect(() => {
    dispatch(getUserExperiences(user.id));
  }, [dispatch]);

  // create an array of user experiences
  const userExp = useSelector((state) => state.experiences.userExperiences);
  const userExperiences = Object.values(userExp);

  // parse the date string to send to the database
  useEffect(() => {
    setStart(Date.parse(timeSlot));
  }, [timeSlot]);

  // get the id from the name of the selected experience
  useEffect(() => {
    let selected = userExperiences?.find((exp) => exp?.name == expSelect);
    setExpId(selected?.id);
    setDuration(selected?.est_duration);
  }, [expSelect, userExperiences]);

  // update selected experience
  const updateExp = (e) => setExpSelect(e.target.value);

  // set validation errors
  useEffect(() => {
    const err = [];
    setErrors(err);
    if (!timeSlot) err.push("Select your availability.");
    if (Date.parse(timeSlot) < Date.parse(now))
      err.push("Select a time in the future.");
    if (!expSelect) err.push("Select an experience.");

    setErrors(err);
  }, [timeSlot, expSelect, start]);

  // send the information to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTimeSlot = {
      exp_id: expId,
      start: start,
    };

    let slot = await dispatch(createOneSlot(expId, newTimeSlot));
    if (slot) {
      if (errors.length === 0) return history.push(`/experiences/${expId}`);
    }
  };

  return (
    <div className="container-inner">
      <br></br>
      <br></br>
      <div className="exp-details">
        Select a date and time to host your experience
      </div>
      <br></br>
      <br></br>
      <div className="form-container">
        <form className=".exp-form" onSubmit={handleSubmit}>
          <select
            className="exp-duration"
            onChange={updateExp}
            value={expSelect}
            placeholder="Select an experience"
          >
            <option value="" disabled selected>
              Select an experience...
            </option>
            {userExperiences.map((exp) => (
              <option key={exp.name}>{exp.name}</option>
            ))}
          </select>
          <div className="exp-date-time">
            <DateTimePicker
              className="exp-date-time"
              onChange={(datetime) => setTimeSlot(datetime)}
              value={timeSlot}
            />
          </div>
          <ul className="errors">
            {errors?.length > 0 &&
              errors.map((err) => (
                <div id="err" key={err}>
                  {err}
                </div>
              ))}
          </ul>
          <button
            className="exp-host-availability"
            type="submit"
            disabled={!!errors?.length}
          >
            Submit availability
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpTimeSlots;
