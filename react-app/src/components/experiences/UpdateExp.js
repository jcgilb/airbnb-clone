import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import {
  updateOneExperience,
  getOneExperience,
} from "../../store/experiences.js";
import "./ExpDetails.css";
import DeleteExperience from "./DeleteExp.js";
import ExpImages from "../images/ExpImage.js";
import "./NewExp.css";

const UpdateExp = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let { expId } = useParams();
  expId = parseInt(expId);

  // useEffect(() => {
  //   dispatch(getOneExperience(expId));
  // }, [dispatch]);

  const experiences = useSelector((state) => state.experiences.experiences);
  const experience = Object.values(experiences).find((exp) => exp.id === expId);
  // getters and setters for the form
  const presetHours = ["<2", "2-5", "All day"];
  // const [lat, setLat] = useState(experience?.lat);
  // const [lng, setLng] = useState(experience?.lng);
  const [city, setCity] = useState(experience?.city);
  const [title, setTitle] = useState(experience?.name);
  const [cost, setCost] = useState(experience?.price);
  const [expState, setExpState] = useState(experience?.state);
  const [durationSelect, setDurationSelect] = useState();
  const [address, setAddress] = useState(experience?.address);
  const [country, setCountry] = useState(experience?.country);
  const [validationErrors, setValidationErrors] = useState([]);
  const [estDuration, setEstDuration] = useState(experience?.est_duration);
  const [description, setDescription] = useState(experience?.description);

  const user = useSelector((state) => state.session.user);
  console.log(experience?.est_duration);

  useEffect(() => {
    if (experience?.est_duration === 120) setDurationSelect(presetHours[0]);
    if (experience?.est_duration === 300) setDurationSelect(presetHours[1]);
    if (experience?.est_duration === 480) setDurationSelect(presetHours[2]);
  }, []);

  // form validations
  // form validations
  useEffect(() => {
    const errors = [];
    setValidationErrors(errors);
    if (!title) errors.push("A title is required.");
    if (!city) errors.push("A city is required.");
    if (!cost) errors.push("A price is required.");
    if (isNaN(cost)) errors.push("Enter a valid price.");
    if (!country) errors.push("A country is required.");
    if (!address) errors.push("An address is required.");
    if (!description) errors.push("A description is required.");
    // if (isNaN(lat) || isNaN(lng))
    //   errors.push("Latitude and Longitude must be numbers.");

    setValidationErrors(errors);
  }, [title, description, cost, address, city, country]);

  // set the user albums
  const updateDuration = (e) => setDurationSelect(e.target.value);

  // helper function for clearing the form
  const revert = () => {
    setCost();
    setCity("");
    setTitle("");
    setExpState();
    setAddress("");
    setCountry("");
    setEstDuration();
    setDescription("");
  };

  // handle submit onClick event
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload;

    if (durationSelect === "<2") {
      payload = {
        city: city,
        name: title,
        price: cost,
        country: country,
        address: address,
        host_id: user.id,
        est_duration: 120,
        // lat: parseFloat(lat),
        // lng: parseFloat(lng),
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
        // lat: parseFloat(lat),
        // lng: parseFloat(lng),
        state: String(expState),
        description: description,
      };
    }
    if (durationSelect === "All day") {
      payload = {
        city: city,
        name: title,
        price: cost,
        est_duration: 480,
        country: country,
        address: address,
        host_id: user.id,
        // lat: parseFloat(lat),
        // lng: parseFloat(lng),
        state: String(expState),
        description: description,
      };
    }
    revert();
    let exp = await dispatch(updateOneExperience(expId, payload)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setValidationErrors(data.errors);
        if (data && !data.errors) return history.push(`/experiences/${expId}`);
      }
    );
    if (exp) {
      if (validationErrors.length === 0) dispatch(getOneExperience(expId));
      return history.push(`/experiences/${expId}`);
    }
  };

  return (
    <>
      <br></br>
      <div className="exp-details">Edit experience details</div>
      <br></br>
      <div className="form-container">
        <br></br>
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
          {/* <div>
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
          </div> */}
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
          <div className="submit-or-delete">
            <button
              className="exp-host"
              type="submit"
              disabled={!!validationErrors.length}
            >
              Submit
            </button>
            <DeleteExperience />
          </div>
        </form>
      </div>

      <div className="exp-details">Upload an image</div>
      <br></br>
      <div className="form-container">
        <div>
          <ExpImages />
        </div>
      </div>
      <br></br>
      <br></br>
    </>
  );
};
export default UpdateExp;
