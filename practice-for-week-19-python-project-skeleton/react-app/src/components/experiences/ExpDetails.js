import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import {
  getAllExperiences,
  getOneExperience,
} from "../../store/experiences.js";
import "./ExpDetails.css";

const ExperienceDetails = () => {
  const history = useHistory();
  const { expId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneExperience(expId));
  }, [dispatch]);

  const exp = useSelector((state) => state.experiences.oneExperience);
  const expImgArr = exp["images"];

  const getAvgStars = (exp) => {};

  const containerStyle = {
    width: "400px",
    height: "400px",
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };

  // const { isLoaded } = useJsApiLoader({
  //   id: "google-map-script",
  //   googleMapsApiKey: "AIzaSyA4EVe6k80NNAS-5owOJ4zKJ9rwDJtpYTw",
  // });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!exp?.id) return null;

  return (
    <div>
      <div className="details-title">{exp?.name}</div>
      <div className="details-subtitle">
        <div className="stars">{getAvgStars(exp)}</div>
        <div className="location">
          {exp?.city}, {exp?.state}, {exp?.country}
        </div>
      </div>
      <div className="details-images">
        <img className="pic1" alt="img" src={expImgArr[0]?.image_url}></img>
        <img className="pic2" alt="img" src={expImgArr[1]?.image_url}></img>
        <div className="pic3-pic4">
          <img className="pic3" alt="img" src={expImgArr[2]?.image_url}></img>
          <img className="pic4" alt="img" src={expImgArr[3]?.image_url}></img>
        </div>
        <img className="pic5" alt="img" src={expImgArr[4]?.image_url}></img>
      </div>
      <div className="details">
        Experience hosted by {exp["exp_host"]?.first_name}
      </div>
      <div className="details-duration">{exp?.est_duration / 60} hours</div>
      <hr></hr>
      <div className="details">What you'll do</div>
      <div className="details-description">{exp?.description}</div>
      <hr></hr>
      <div className="details">Choose from available dates</div>
      <div className="details-dates">
        <div className="available-date">
          <div>week, month day</div>
          <div>start time - end time</div>
          <div>${exp.price}/person</div>
          <div className="book-exp">Choose</div>
        </div>
        <div className="available-date">
          <div>week, month day</div>
          <div>start time - end time</div>
          <div>${exp.price}/person</div>
          <div className="book-exp">Choose</div>
        </div>
        <div className="available-date">
          <div>week, month day</div>
          <div>start time - end time</div>
          <div>${exp.price}/person</div>
          <div className="book-exp">Choose</div>
        </div>
        <div className="available-date">
          <div>week, month day</div>
          <div>start time - end time</div>
          <div>${exp.price}/person</div>
          <div className="book-exp">Choose</div>
        </div>
        <div className="available-date">
          <div>week, month day</div>
          <div>start time - end time</div>
          <div>${exp.price}/person</div>
          <div className="book-exp">Choose</div>
        </div>
      </div>
      <div className="details-map">
        <LoadScript
          googleMapsApiKey="AIzaSyC44LmEfw4hs78DkfdGjAnAXbL6PO8-AUQ"
          // libraries={libraries}
        >
          <GoogleMap
            // mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            // onLoad={onMapLoad}
          >
            {/* {markers.map((marker) => (
              <Marker
                key={marker.time.toISOString()}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                  setCurSelect(marker);
                }}
              />
            ))} */}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};
export default ExperienceDetails;
