import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import {
  editOneExperience,
  getOneExperience,
} from "../../store/experiences.js";
import "./ExpDetails.css";
import DeleteExperience from "./DeleteExp.js";

const UpdateExp = () => {
  // getters and setters for the form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState();
  const [estDuration, setEstDuration] = useState("");
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState();
  const [validationErrors, setValidationErrors] = useState([]);
  const [hoursSelect, setHoursSelect] = useState([]);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [durationSelect, setDurationSelect] = useState();
  const presetHours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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
    setState();
    setCountry("");
    setPrice();
    setEstDuration();
  };

  // handle submit onClick event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const UpdateExp = {};
    revert();
    let exp = await dispatch(createOneExperience()).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setValidationErrors(data.errors);
    });
    if (exp) {
      if (validationErrors.length === 0)
        return history.push(`/experiences/${exp.id}`);
    }
  };

  return (
    <>
      <br></br>
      <br></br>
      <div className="exp-datials">Edit experience details below</div>
      <div className="">
        <br></br>
        <form className="" onSubmit={handleSubmit}>
          <input
            type="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="city"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="state"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <input
            type="country"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <input
            type="estDuration"
            placeholder="Estimated duration"
            value={estDuration}
            onChange={(e) => setEstDuration(e.target.value)}
          />
          <input
            type="price"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            Submit
          </button>
        </form>
        <DeleteExperience />
      </div>
    </>
  );
};
export default UpdateExp;
