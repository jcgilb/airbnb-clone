import React, { useState } from "react";
import { useSelector } from "react-redux";
import DeleteExpImg from "./DeleteExpImage";
import "./AllImages.css";
import "./DeleteImage.css";

const AllImages = ({ exp }) => {
  const [showAll, setShowAll] = useState(false);
  const [chevDown, setChevDown] = useState(true);

  // get the user and the experience
  const user = useSelector((state) => state.session.user);
  const images = exp["images"];

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
