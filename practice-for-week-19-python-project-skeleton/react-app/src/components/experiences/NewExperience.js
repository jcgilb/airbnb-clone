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
import "./ExpDetails.css";
import AvailableTimes from "../timeSlots/AvailableTimes.js";

const NewExperience = () => {
  // getters and setters for the form
  const presetHours = ["<2", "2-5", "All day"];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [expState, setExpState] = useState();
  const [estDuration, setEstDuration] = useState("");
  const [country, setCountry] = useState("");
  const [cost, setCost] = useState();
  const [validationErrors, setValidationErrors] = useState([]);
  const [hoursSelect, setHoursSelect] = useState([]);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [durationSelect, setDurationSelect] = useState();

  const user = useSelector((state) => state.session.user);

  const dispatch = useDispatch();
  const history = useHistory();

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
    setTitle("");
    setDescription("");
    setAddress("");
    setCity("");
    setExpState("");
    setCountry("");
    setCost();
    setEstDuration();
  };

  // handle submit onClick event
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload;
    console.log(durationSelect);

    if (durationSelect === "<2") {
      payload = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        city: city,
        name: title,
        state: String(expState),
        price: cost,
        country: country,
        address: address,
        host_id: user.id,
        description: description,
        est_duration: 120,
      };
    }
    if (durationSelect === "2-5") {
      payload = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        city: city,
        name: title,
        state: String(expState),
        price: cost,
        country: country,
        address: address,
        host_id: user.id,
        description: description,
        est_duration: 300,
      };
    }
    if (durationSelect === "All day") {
      payload = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        city: city,
        name: title,
        state: String(expState),
        price: cost,
        country: country,
        address: address,
        host_id: user.id,
        description: description,
        est_duration: 0,
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
      <div className="exp-datials">Host An Experience</div>
      <div className="">
        <br></br>
        <form className="" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="State"
            value={expState}
            onChange={(e) => setExpState(e.target.value)}
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="text"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
          <input
            type="text"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
          <input
            type="float"
            placeholder="Price"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          <select
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
          <ul className="errors">
            {validationErrors.length > 0 &&
              validationErrors.map((err) => (
                <div id="err" key={err}>
                  {err}
                </div>
              ))}
          </ul>
          <button
            className=""
            type="submit"
            disabled={!!validationErrors.length}
          >
            Become a host
          </button>
        </form>
      </div>
    </>
  );
};
export default NewExperience;
