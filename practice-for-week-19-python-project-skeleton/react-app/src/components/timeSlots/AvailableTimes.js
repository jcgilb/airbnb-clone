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

const AvailableTimes = () => {
  const history = useHistory();
  const { expId } = useParams();
  const dispatch = useDispatch();
  const [week, setWeek] = useState();
  const [endTime, setEndTime] = useState();
  const [monthDay, setMonthDay] = useState();
  const [timeSlot, setTimeSlot] = useState();
  const [startTime, setStartTime] = useState();
  const [showAll, setShowAll] = useState(false);
  const [chevDown, setChevDown] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [now, setNow] = useState(Date.parse(new Date()));

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

  // get the experience
  useEffect(() => {
    dispatch(getOneExperience(expId));
  }, []);

  // send the information to the database
  let futureSlots = slots.filter((slot) => slot.start >= now);
  let sortedSlots = qsort(futureSlots);
  console.log(futureSlots);
  console.log(sortedSlots);
  const fiveSlots = sortedSlots?.slice(0, 5);
  const availabileTimes = fiveSlots?.map((slot) => {
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
      <div className="available-date">
        <div>
          {week}, {monthDay}, {year}
        </div>
        <div>
          {start} - {end}
        </div>
        <div>${exp?.price}/person</div>
        <button className="book-exp" onClick={() => setShowModal(true)}>
          Choose
        </button>

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <BookingForm
              exp={exp}
              end={end}
              slot={slot}
              week={week}
              start={start}
              expId={expId}
              monthDay={monthDay}
            />
          </Modal>
        )}
      </div>
    );
  });

  const allAvailabileTimes = sortedSlots?.map((slot) => {
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
      <div className="available-date">
        <div>
          {week}, {monthDay}, {year}
        </div>
        <div>
          {start} - {end}
        </div>
        <div>${exp?.price}/person</div>
        <button className="book-exp" onClick={() => setShowModal(true)}>
          Choose
        </button>

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <BookingForm
              exp={exp}
              end={end}
              slot={slot}
              week={week}
              start={start}
              expId={expId}
              monthDay={monthDay}
            />
          </Modal>
        )}
      </div>
    );
  });

  console.log(exp.host_id, user.id);

  return (
    <div>
      {chevDown && slots.length >= 5 && (
        <div
          onClick={(e) => {
            setShowAll(true);
            setChevDown(false);
          }}
        >
          View all <i className="fa-solid fa-chevron-down"></i>
        </div>
      )}
      {!chevDown && showAll && (
        <div
          onClick={(e) => {
            setShowAll(false);
            setChevDown(true);
          }}
        >
          View less <i className="fa-solid fa-chevron-up"></i>
        </div>
      )}
      {exp.host_id === user.id && (
        <div onClick={(e) => history.push(`/experiences/${expId}/dates`)}>
          Add dates <i className="fa-solid fa-plus"></i>
        </div>
      )}
      {!showAll && <div className="details-dates">{availabileTimes}</div>}
      {showAll && <div className="details-dates">{allAvailabileTimes}</div>}
    </div>
  );
};

export default AvailableTimes;
