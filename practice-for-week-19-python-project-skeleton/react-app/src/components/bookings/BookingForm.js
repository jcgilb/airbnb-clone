import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { createOneBooking } from "../../store/bookings";
import "./BookingForm.css";

function BookingForm({ exp, expId, end, slot, start, week, monthDay }) {
  const dispatch = useDispatch();
  const history = useHistory();
  // getters and setters for the login form
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  // get the user and the experience
  const user = useSelector((state) => state.session.user);
  const bookings = exp["bookings"];
  const slots = exp["time_slots"];

  const bookTimeSlot = async (e, slot) => {
    console.log("hi");
    // setTimeSlot(slot);
    e.preventDefault();

    console.log(exp.id, "expId");
    console.log(user.id, "user.id");
    console.log(slot.id, "slot.id");
    const payload = {
      exp_id: expId,
      user_id: user.id,
      time_slot_id: slot.id,
    };
    const booking = await dispatch(createOneBooking(expId, payload));

    if (booking) {
      return history.push(`/users/${user.id}/bookings`);
    }
  };

  return (
    <div className="booking-form">
      <div className="details-title">Booking details</div>
      <div className="booking-details">
        {week}, {monthDay}
      </div>
      <div className="booking-details">
        {start} - {end}
      </div>
      <div className="booking-details">${exp?.price}/person</div>
      <button
        className="book-exp-confirm"
        onClick={(e) => bookTimeSlot(e, slot)}
      >
        Book this experience
      </button>
    </div>
  );
}

export default BookingForm;
