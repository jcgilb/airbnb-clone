import React, { useEffect, useState } from "react";
import { useDeferredValue } from "react";
import DateTimePicker from "react-datetime-picker";
import { useSelector, useDispatch } from "react-redux";
import { getAllExperiences, getOneExperience } from "../../store/experiences";
import "./ExpTimeSlots.css";

const ExpTimeSlots = () => {
  const dispatch = useDispatch();
  const [expId, setExpId] = useState(null);
  const [errors, setErrors] = useState();
  const [timeSlot, setTimeSlot] = useState();
  const [now, setNow] = useState(new Date());
  const [expSelect, setExpSelect] = useState();
  const [endTime, setEndTime] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(startDate);

  // get all experiences
  useEffect(() => {
    dispatch(getAllExperiences());
    if (expId !== null) dispatch(getOneExperience(expId));
  }, [dispatch, expId]);

  // get the user and the user's experiences
  const experience = useSelector((state) => state.experiences.oneExperience);
  const experiences = useSelector((state) => state.experiences);
  const user = useSelector((state) => state.session.user);
  const userExperiences = Object.values(experiences).filter(
    (exp) => exp.host_id === user.id
  );

  // parse the date string to send to the database
  useEffect(() => {
    console.log(timeSlot);
    console.log(typeof String(timeSlot));
    console.log(String(timeSlot).slice(0, 4));
    setStartTime(
      `${String(timeSlot).slice(0, 3)}, ${String(timeSlot).slice(4, 10)}`
    );
    console.log(startTime, "my start time");
    console.log(String(timeSlot).slice(4, 10));
    console.log(String(timeSlot).slice(16, 21));
    console.log(String(timeSlot).slice(16, 18));
    if (parseInt(String(timeSlot).slice(16, 18)) > 12) {
      console.log(parseInt(String(timeSlot).slice(16, 18)) - 12);
    }
    console.log(Date.parse(timeSlot));
    console.log(Date.parse(now));
    console.log(Date.parse(timeSlot) < Date.parse(now), "true/false");
  }, [timeSlot]);

  // get the id from the name of the selected experience
  useEffect(() => {
    let selected = userExperiences?.find((exp) => exp?.name == expSelect);
    setExpId(selected?.id);
    console.log(selected);
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

    for (let i = 0; i < experience["time_slots"]?.length; i++) {
      let x = experience["time_slots"][i];
      console.log(x, "x");
      if (
        parseInt(x.start_time) === parseInt(startTime) &&
        parseInt(x.start_date) === parseInt(startDate)
      ) {
        err.push("Time slot already exists.");
      }
      if (
        parseInt(x.end_time) < parseInt(startTime) &&
        parseInt(x.start_date) === parseInt(startDate)
      )
        err.push("Conflicting availability.");
    }

    setErrors(err);
  }, [timeSlot, expSelect, startTime, startDate, experience]);

  // send the information to the database
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTimeSlot = {
      exp_id: expId,
      start_time: startTime,
      end_time: endTime,
      start_date: startDate,
      end_date: endDate,
    };
  };

  return (
    <div className="date-time-picker">
      <form className="" onSubmit={handleSubmit}>
        <div className="date-time-picker">
          Select a date and time to host your experience
        </div>
        <select
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
        <div>
          <DateTimePicker
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
          className="upload-submit"
          type="submit"
          disabled={!!errors?.length}
        >
          Submit availability
        </button>
      </form>
    </div>
  );
};

export default ExpTimeSlots;
