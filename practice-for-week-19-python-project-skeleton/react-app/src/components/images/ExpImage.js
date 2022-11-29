import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { ceateExpImage } from "../../store/images.js";

const AddExpImages = ({ preview }) => {
  const [validationErrors, setValidationErrors] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  let { expId } = useParams();
  expId = parseInt(expId);

  // form validations
  useEffect(() => {
    const errors = [];
    setValidationErrors(errors);

    setValidationErrors(errors);
  }, []);

  // handle submit onClick event
  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      exp_id: expId,
      image_url: imageUrl,
      preview: false,
    };

    let img = await dispatch(ceateExpImage(expId, payload)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setValidationErrors(data.errors);
      }
    );
    if (img) {
      if (validationErrors.length === 0)
        return history.push(`/experiences/${expId}`);
    }
  };

  return (
    <div>
      <form className="" onSubmit={handleSubmit}>
        <input
          type="imageUrl"
          placeholder="Image Url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <ul className="errors">
          {validationErrors.length > 0 &&
            validationErrors.map((err) => (
              <div id="err" key={err}>
                {err}
              </div>
            ))}
        </ul>
        <button className="" type="submit" disabled={!!validationErrors.length}>
          Add preview image
        </button>
      </form>
    </div>
  );
};
export default AddExpImages;
