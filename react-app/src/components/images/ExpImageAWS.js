import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { uploadExpImage } from "../../store/images.js";
import ImageUploading from "react-images-uploading";
import "../experiences/NewExp.css";
import { getOneExperience } from "../../store/experiences.js";
import { useSubmitted } from "../../context/SubmittedContext.js";

const ExpImageUpload = (showModal, setShowModal) => {
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState([]);

  const { submitted, setSubmitted } = useSubmitted();

  const dispatch = useDispatch();
  const history = useHistory();

  // parse exp id from url
  let { expId } = useParams();
  expId = parseInt(expId);

  // handle add/update image
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImages(imageList);
  };

  // err validations
  useEffect(() => {
    const err = [];
    // create an array of image files
    let imageFiles = images?.map((img) => img.file);
    // loop through the array and check the size of each
    for (let i = 0; i < imageFiles.length; i++) {
      let img = imageFiles[i];
      // limit image file size to 1MB => 1000KB => 1,000,000 bites
      if (img.size > 1000000) err.push("Limit image size to 1MB.");
    }
    setErrors(err);
  }, [images]);

  // handle form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageFiles = images?.map((img) => img.file);
    await uploadImages(expId, imageFiles);
    await dispatch(getOneExperience(expId));
    history.push(`/experiences/${expId}`);
  };

  // send image files to thunk
  const uploadImages = async (expId, imageFiles) => {
    for (let i = 0; i < imageFiles.length; i++) {
      let img = imageFiles[i];

      let newExpImage = {
        exp_id: expId,
        file: img,
        newFile: true,
      };

      // destructure the newExpImage object to easily append items to form
      const { review_id, file, newFile } = newExpImage;

      const form = new FormData();
      form.append("file", file);
      form.append("review_id", review_id);
      form.append("newFile", newFile);

      // send form data and exp id to thunk
      await dispatch(uploadExpImage(expId, form));
      await setSubmitted(true);
    }
  };

  return (
    <form className="exp-form" onSubmit={handleSubmit}>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={6}
        dataURLKey="data_url"
        acceptType={["jpg", "png", "jpeg"]}
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div
            className="upload-image-wrapper"
            {...dragProps}
            style={isDragging ? { color: "rgb(255, 22, 84)" } : undefined}
          >
            <div
              {...dragProps}
              style={isDragging ? { color: "rgb(255, 22, 84)" } : undefined}
            >
              Drag & Drop to Upload Files
            </div>
            <div>OR</div>
            <button
              style={isDragging ? { color: "rgb(255, 22, 84)" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
              className="add-img-button"
            >
              Browse
            </button>
            <ul className="errors">
              {errors.length > 0 &&
                errors.map((err) => (
                  <div id="err" key={err}>
                    {err}
                  </div>
                ))}
            </ul>
            <div className="image-area">
              {imageList?.map((image, index) => (
                <div key={index} className="image-item">
                  <img
                    className="rvw-img-preview"
                    src={image["data_url"]}
                    alt=""
                  />
                  <div className="images-to-submit">
                    <button
                      className="rm-update"
                      onClick={() => onImageUpdate(index)}
                    >
                      Update
                    </button>
                    <button
                      className="rm-update"
                      onClick={() => {
                        onImageRemove(index);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
      <ul className="errors">
        {errors.length > 0 &&
          errors.map((err) => (
            <div id="err" key={err}>
              {err}
            </div>
          ))}
      </ul>
      <button className="exp-image" type="submit" disabled={!!errors.length}>
        Upload
      </button>
    </form>
  );
};
export default ExpImageUpload;
