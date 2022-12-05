import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneExperience } from "../../store/experiences";
import BookingFormModal from "../bookings/BookingModal";
import { getAllSlots } from "../../store/timeSlots";
import BookingForm from "../bookings/BookingForm";
import { bindActionCreators } from "redux";
import { Modal } from "../../context/Modal";
import "../experiences/ExpDetails.css";
import DeleteTimeSlot from "./DeleteTimeSlots";

const AvailableTimes = () => {
  const history = useHistory();
  const { expId } = useParams();
  const dispatch = useDispatch();
  const [formSlot, setFormSlot] = useState();
  const [showAll, setShowAll] = useState(false);
  const [chevDown, setChevDown] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [now, setNow] = useState(Date.parse(new Date()));

  // get the user and the experience
  const user = useSelector((state) => state.session.user);
  const exp = useSelector((state) => state.experiences.oneExperience);
  const bookings = exp["bookings"];
  const slots = exp["time_slots"];

  // loop through the time slots and bookings to find booked slots
  for (let i = 0; i < slots.length; i++) {
    let slot = slots[i];
    for (let j = 0; j < bookings.length; j++) {
      let booking = bookings[j];
      if (slot.id === booking.time_slot_id) {
        slot.booked = true;
      }
    }
  }

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

  // get the experience
  useEffect(() => {
    dispatch(getAllSlots(expId));
    dispatch(getOneExperience(expId));
    return () => {
      setShowAll(false);
    };
  }, []);

  // send the information to the database
  let futureSlots = slots.filter((slot) => slot.start >= now);
  let sortedSlots = qsort(futureSlots);
  let timeSlotArray;
  if (!showAll) {
    timeSlotArray = sortedSlots?.slice(0, 5);
  }
  if (showAll) {
    timeSlotArray = sortedSlots;
  }

  const availableTimes = timeSlotArray.map((slot) => {
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
    if (start == "0AM") {
      start = "12AM";
      end = String(parseInt(exp.est_duration / 60)).concat("AM");
    }
    console.log(start, end, "start, end");

    return (
      <div className="available-date">
        <div className="time">
          {week}, {monthDay}, {year}
        </div>
        <div className="time">
          {start} - {end}
        </div>
        <div className="time">${exp?.price}/person</div>
        {slot.booked !== true && (
          <button
            className="book-exp"
            onClick={() => {
              if (!user) return alert("You must be logged in first.");
              setFormSlot(slot);
              setShowModal(true);
            }}
          >
            Choose
          </button>
        )}
        {slot.booked === true && (
          <button
            className="booked-exp"
            onClick={() => {
              setFormSlot(slot);
            }}
          >
            Booked
          </button>
        )}

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <BookingForm exp={exp} slot={formSlot} expId={expId} />
          </Modal>
        )}
        {exp.host_id === user?.id && <DeleteTimeSlot slotId={slot.id} />}
      </div>
    );
  });

  return (
    <div>
      {chevDown && slots.length > 5 && (
        <div
          onClick={(e) => {
            setShowAll(true);
            setChevDown(false);
          }}
        >
          View all{" "}
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-chevron-down"
          ></i>
        </div>
      )}
      {!chevDown && showAll && (
        <div
          onClick={(e) => {
            setShowAll(false);
            setChevDown(true);
          }}
        >
          View less{" "}
          <i
            style={{ cursor: "pointer" }}
            className="fa-solid fa-chevron-up"
          ></i>
        </div>
      )}
      {exp.host_id === user?.id && (
        <div
          style={{ cursor: "pointer" }}
          onClick={(e) => history.push(`/experiences/${expId}/dates`)}
        >
          Add dates <i className="fa-solid fa-plus"></i>
        </div>
      )}
      <div className="details-dates">{availableTimes}</div>
    </div>
  );
};

export default AvailableTimes;
