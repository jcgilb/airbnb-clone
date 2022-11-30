import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import {
  createOneExperience,
  getAllExperiences,
  getOneExperience,
} from "../../store/experiences.js";
import "./NewExp.css";
import AvailableTimes from "../timeSlots/AvailableTimes.js";
import ExpImages from "../images/ExpImage.js";

const NewExperience = () => {
  // getters and setters for the form
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [cost, setCost] = useState();
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [expState, setExpState] = useState();
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const presetHours = ["<2", "2-5", "All day"];
  const [hoursSelect, setHoursSelect] = useState([]);
  const [estDuration, setEstDuration] = useState("");
  const [description, setDescription] = useState("");
  const [durationSelect, setDurationSelect] = useState();
  const [validationErrors, setValidationErrors] = useState([]);

  const user = useSelector((state) => state.session.user);

  const history = useHistory();
  const dispatch = useDispatch();

  // form validations
  useEffect(() => {
    const errors = [];
    setValidationErrors(errors);

    setValidationErrors(errors);
  }, []);

  // set the user albums
  const updateDuration = (e) => setDurationSelect(e.target.value);

  // helper function for clearing the form
  const revert = () => {
    setCost();
    setCity("");
    setTitle("");
    setCountry("");
    setAddress("");
    setExpState("");
    setEstDuration();
    setDescription("");
  };

  // handle submit onClick event
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload;
    console.log(durationSelect);

    if (durationSelect === "<2") {
      payload = {
        city: city,
        name: title,
        price: cost,
        country: country,
        address: address,
        host_id: user.id,
        est_duration: 120,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        state: String(expState),
        description: description,
      };
    }
    if (durationSelect === "2-5") {
      payload = {
        city: city,
        name: title,
        price: cost,
        country: country,
        address: address,
        host_id: user.id,
        est_duration: 300,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        state: String(expState),
        description: description,
      };
    }
    if (durationSelect === "All day") {
      payload = {
        city: city,
        name: title,
        price: cost,
        est_duration: 0,
        address: address,
        country: country,
        host_id: user.id,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        state: String(expState),
        description: description,
      };
    }
    revert();
    let exp = await dispatch(createOneExperience(payload)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setValidationErrors(data.errors);
      }
    );
    if (exp.id) {
      if (validationErrors.length === 0)
        return history.push(`/experiences/${exp.id}`);
    }
  };

  return (
    <>
      <br></br>
      <br></br>
      <div className="exp-details">Host An Experience</div>
      <br></br>
      <br></br>
      <div className="form-container">
        <form className=".exp-form" onSubmit={handleSubmit}>
          <div>
            <input
              className="exp-name"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <textarea
              className="exp-description"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <input
              className="exp-address"
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <input
              className="exp-city"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <input
              className="exp-state"
              type="text"
              placeholder="State"
              value={expState}
              onChange={(e) => setExpState(e.target.value)}
            />
          </div>
          <div>
            <input
              className="exp-country"
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div>
            <input
              className="exp-lat"
              type="text"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div>
            <input
              className="exp-lng"
              type="text"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </div>

          <div className="price">
            <input
              className="exp-price"
              type="float"
              placeholder="Price"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <div>
            <select
              className="exp-duration"
              onChange={updateDuration}
              value={durationSelect}
              placeholder="Estimated duration"
            >
              <option value="" disabled selected>
                Estimated duration (hrs)...
              </option>
              {presetHours.map((hr) => (
                <option key={hr}>{hr}</option>
              ))}
            </select>
          </div>

          <ul className="errors">
            {validationErrors.length > 0 &&
              validationErrors.map((err) => (
                <div id="err" key={err}>
                  {err}
                </div>
              ))}
          </ul>
          <button
            className="exp-host"
            type="submit"
            disabled={!!validationErrors.length}
          >
            Become a host
          </button>
        </form>
        <ExpImages />
      </div>
      <br></br>
      <br></br>
    </>
  );
};
export default NewExperience;
