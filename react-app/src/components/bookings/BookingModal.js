import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Modal } from "../../context/Modal";
import BookingForm from "./BookingForm";

function BookingFormModal() {
  const [showModal, setShowModal] = useState(false);
  const { expId } = useParams();

  const myStyles = {
    background: "none",
    boxSizing: "border-box",
    border: "1px solid white",
    padding: "6px",
    borderRadius: "3px",
    color: "white",
    fontSize: "14.5px",
  };

  return (
    <>
      <button style={myStyles} onClick={() => setShowModal(true)}>
        Choose
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <BookingForm />
        </Modal>
      )}
    </>
  );
}

export default BookingFormModal;
