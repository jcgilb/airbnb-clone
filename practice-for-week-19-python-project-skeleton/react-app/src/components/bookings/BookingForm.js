import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { createOneBooking } from "../../store/bookings";
import "./BookingForm.css";

function BookingForm({ exp, expId, slot }) {
  const dispatch = useDispatch();
  const history = useHistory();
  console.log(slot, "this is the time slot");

  // get the user and the experience
  const user = useSelector((state) => state.session.user);
  const bookings = exp["bookings"];

  const bookTimeSlot = async (e, slot) => {
    e.preventDefault();

    const payload = {
      exp_id: parseInt(expId),
      user_id: user.id,
      time_slot_id: slot.id,
    };

    console.log(expId, payload, "this is what im sending to my thunk");
    const booking = await dispatch(createOneBooking(expId, payload));

    if (booking) {
      return history.push(`/users/${user.id}`);
    }
  };

  let dateEnd = String(new Date(parseInt(slot.end)));
  let dateStart = String(new Date(parseInt(slot.start)));
  let end = dateEnd;
  let week = dateStart.slice(0, 3);
  let year = dateStart.slice(11, 15);
  let start = dateStart.slice(16, 18);
  let monthDay = dateStart.slice(4, 10);
  const minutes = dateStart.slice(22, 24);

  start = parseInt(start);
  end = start + parseInt(exp.est_duration / 60);

  if (start < 12) {
    start = String(start).concat("AM");
  }
  if (parseInt(start) === 12) {
    start = String(12).concat("PM");
  }
  if (parseInt(end) === 12) {
    end = String(12).concat("PM");
  }
  if (parseInt(start) > 12) {
    start = String(parseInt(dateStart.slice(16, 18)) - 12).concat("PM");

    if (parseInt(end) > 24) {
      end = String(parseInt(end) - 24).concat("AM");
    }
  }
  if (parseInt(end) > 12) {
    end = String(parseInt(end) - 12).concat("PM");
  }

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
