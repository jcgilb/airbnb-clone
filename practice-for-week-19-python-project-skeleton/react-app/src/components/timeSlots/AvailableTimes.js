import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { getAllSlots } from "../../store/timeSlots";
import { createOneBooking } from "../../store/bookings";
import { getOneExperience } from "../../store/experiences";
import "../experiences/ExpDetails.css";
import { bindActionCreators } from "redux";

const AvailableTimes = () => {
  const history = useHistory();
  const { expId } = useParams();
  const dispatch = useDispatch();
  const [week, setWeek] = useState();
  const [endTime, setEndTime] = useState();
  const [monthDay, setMonthDay] = useState();
  const [timeSlot, setTimeSlot] = useState();
  const [startTime, setStartTime] = useState();

  // get the user and the experience
  const user = useSelector((state) => state.session.user);
  const exp = useSelector((state) => state.experiences.oneExperience);
  const bookings = exp["bookings"];
  const slots = exp["time_slots"];

  // Sort the slots
  const sorted = exp["time_slots"];
  function qsort(sorted) {
    if (sorted.length < 2) return sorted;
    const pivot = sorted[0];
    const rest = sorted.slice(1);
    const low = rest.filter((n) => parseInt(n.start) <= parseInt(pivot.start));
    const high = rest.filter((n) => parseInt(n.start) > parseInt(pivot.start));
    return [...qsort(low), pivot, ...qsort(high)];
  }
  console.log(qsort(sorted), "sorted");

  // get the experience
  useEffect(() => {
    dispatch(getOneExperience(expId));
  }, []);

  // send the information to the database
  const bookTimeSlot = async (e, slot) => {
    console.log("hi");
    setTimeSlot(slot);
    e.preventDefault();

    console.log(exp.id, "expId");
    console.log(user.id, "user.id");
    console.log(slot.id, "slot.id");
    const payload = {
      exp_id: exp.id,
      user_id: user.id,
      time_slot_id: slot.id,
    };
    const booking = await dispatch(createOneBooking(expId, payload));

    if (booking) {
      return history.push(`/experiences/${expId}`);
    }
  };

  const fiveSlots = sorted?.slice(0, 5);
  const availabileTimes = fiveSlots?.map((slot) => {
    let dateEnd = String(new Date(parseInt(slot.end)));
    let dateStart = String(new Date(parseInt(slot.start)));
    let end = dateEnd;
    let week = dateStart.slice(0, 3);
    let start = dateStart.slice(16, 18);
    let monthDay = dateStart.slice(4, 10);
    const minutes = dateStart.slice(22, 24);

    start = parseInt(start);
    end = start + parseInt(exp.est_duration / 60);

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

    let buttonText;
    exp?.bookings.forEach((bkg) => {
      if (bkg.user_id === user.id) {
        buttonText = "Booked";
      } else buttonText = "Choose";
    });

    return (
      <div className="available-date">
        <div>
          {week}, {monthDay}
        </div>
        <div>
          {start} - {end}
        </div>
        <div>${exp?.price}/person</div>
        <div className="book-exp" onClick={(e) => bookTimeSlot(e, slot)}>
          {buttonText}
        </div>
      </div>
    );
  });

  return <div className="details-dates">{availabileTimes}</div>;
};

export default AvailableTimes;
