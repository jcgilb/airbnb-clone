import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  createOneExperience,
  getAllExperiences,
} from "../../store/experiences.js";
import "./NewExp.css";

const NewExperience = () => {
  // getters and setters for the form
  // const [lat, setLat] = useState();
  // const [lng, setLng] = useState();
  const [cost, setCost] = useState();
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [expState, setExpState] = useState();
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const presetHours = ["<2", "2-5", "All day"];
  const [description, setDescription] = useState("");
  const [durationSelect, setDurationSelect] = useState();
  const [validationErrors, setValidationErrors] = useState([]);

  const user = useSelector((state) => state.session.user);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(getAllExperiences());
    };
  }, [dispatch]);

  // form validations
  useEffect(() => {
    const errors = [];
    setValidationErrors(errors);
    if (!title) errors.push("A title is required.");
    if (!city) errors.push("A city is required.");
    if (!cost || cost <= 0) errors.push("A price is required.");
    if (isNaN(cost)) errors.push("Enter a valid price.");
    if (!country) errors.push("A country is required.");
    if (!address) errors.push("An address is required.");
    if (!description) errors.push("A description is required.");
    if (title && title.length > 250)
      errors.push("Title exceeds maximum length.");
    if (city && city.length > 100) errors.push("City exceeds maximum length.");
    if (address && address.length > 100)
      errors.push("Address exceeds maximum length.");
    if (country && country.length > 100)
      errors.push("Country exceeds maximum length.");
    if (description && description.length > 1000)
      errors.push("Description exceeds maximum length.");
    // if (isNaN(lat) || isNaN(lng))
    //   errors.push("Latitude and Longitude must be numbers.");
    setValidationErrors(errors);
  }, [title, description, cost, address, city, country]);

  // set the duration
  const updateDuration = (e) => setDurationSelect(e.target.value);

  // helper function for clearing the form
  const revert = () => {
    setCost();
    setCity("");
    setTitle("");
    setCountry("");
    setAddress("");
    setExpState("");
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
        price: parseFloat(cost).toFixed(2),
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
        price: parseFloat(cost).toFixed(2),
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
        price: parseFloat(cost).toFixed(2),
        est_duration: 480,
        address: address,
        country: country,
        host_id: user.id,
        // lat: parseFloat(lat),
        // lng: parseFloat(lng),
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
    if (exp) {
      return history.push(`/users/${user?.id}`);
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
          <br />
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
          <button
            className="exp-host"
            type="submit"
            disabled={!!validationErrors.length}
          >
            Become a host
          </button>
          <br />
        </form>
        {/* <ExpImages /> */}
        <br />
      </div>
      <br></br>
      <br></br>
    </>
  );
};
export default NewExperience;
