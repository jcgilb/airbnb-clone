import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getOneExperience } from "../../store/experiences.js";
import { ceateExpImage } from "../../store/images.js";
import "../experiences/NewExp.css";

const ExpImages = () => {
  const [validationErrors, setValidationErrors] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [validImage, setValidImage] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  let { expId } = useParams();
  expId = parseInt(expId);

  // form validations
  useEffect(() => {
    const errors = [];
    setValidationErrors(errors);
    if (!imageUrl) errors.push("An image url is required.");
    validateImage(imageUrl);
    if (!validImage) errors.push("Please enter a valid image url.");
    setValidationErrors(errors);
  }, [imageUrl, validImage]);

  // validate the image using the Image object's builtins
  function validateImage(imageUrl) {
    let image = new Image();
    image.onload = function () {
      if (this.width > 0) {
        setValidImage(true);
      }
    };
    image.onerror = function () {
      setValidImage(false);
    };
    image.src = imageUrl;
  }

  // handle submit onClick event
  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      exp_id: expId,
      image_url: imageUrl,
      preview: true,
    };

    let img = await dispatch(ceateExpImage(expId, payload)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setValidationErrors(data.errors);
      }
    );
    if (img) {
      if (validationErrors.length === 0) dispatch(getOneExperience(expId));
      return history.push(`/experiences/${expId}`);
    }
  };

  return (
    <form className="exp-form" onSubmit={handleSubmit}>
      <div>
        <input
          className="exp-img"
          type="imageUrl"
          placeholder="Image Url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
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
        className="exp-image"
        type="submit"
        disabled={!!validationErrors.length}
      >
        Upload image
      </button>
    </form>
  );
};
export default ExpImages;
