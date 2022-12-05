import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneExperience } from "../../store/experiences";
import { Modal } from "../../context/Modal";
import DeleteExpImg from "./DeleteExpImage";
import { deleteExpImage } from "../../store/images.js";

import "./AllImages.css";
import "./DeleteImage.css";

const AllImages = ({ exp }) => {
  const history = useHistory();
  let { expId } = useParams();
  const dispatch = useDispatch();
  const [showAll, setShowAll] = useState(false);
  const [chevDown, setChevDown] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const openMenu = () => {
    if (showDelete) return;
    setShowDelete(true);
  };

  // close the menu if a user clicks anywhere outside of it
  useEffect(() => {
    if (!showDelete) return;
    const closeDelete = () => {
      setShowDelete(false);
    };
    document.addEventListener("click", closeDelete);
    return () => document.removeEventListener("click", closeDelete);
  }, [showDelete]);

  // get the user and the experience
  const user = useSelector((state) => state.session.user);
  // const exp = useSelector((state) => state.experiences.oneExperience);
  const images = exp["images"];
  console.log(images);

  const handleClick = async (e, img) => {
    e.preventDefault();
    await dispatch(deleteExpImage(expId, img.id));
    dispatch(getOneExperience(expId));
    return history.push(`/experiences/${expId}`);
  };

  return (
    <div>
      {chevDown && images.length > 5 && (
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
      {showAll && (
        <div className="flex-row-wrap">
          {images.slice(5, images.length).map((img) => (
            <div key={img.id} className="exp-img-card">
              <div className="img-card" key={"image"}>
                <img className="img-card" alt={img.id} src={img.image_url} />
              </div>

              {user?.id === exp.host_id && (
                <div className="delete-images">
                  <DeleteExpImg user={user?.id} exp={exp} imgId={img?.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllImages;
