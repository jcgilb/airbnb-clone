import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import ImageUploading from "react-images-uploading";
import { getAllReviews, uploadRvwImage } from "../../store/reviews.js";
import "./RvwImage.css";

function UploadReviewImage2() {
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch();
  const history = useHistory();

  // parse exp id from url
  let { expId, rvwId } = useParams();
  rvwId = parseInt(rvwId);
  expId = parseInt(expId);

  useEffect(() => {
    dispatch(getAllReviews(expId));
  }, [dispatch, expId, rvwId]);

  // state objs
  // const user = useSelector((state) => state.session.user);
  // const rvwImages = useSelector((state) => state.images.rvwImages);
  const reviews = useSelector((state) => state.reviews.reviews);
  const rvwArr = Object.values(reviews);
  const rvw = rvwArr.find((item) => item.id === rvwId);
  console.log(rvw, "rvw");
  const exps = useSelector((state) => state.experiences.experiences);
  const expArr = Object.values(exps);
  const exp = expArr.find((item) => item.id === rvw?.exp_id);
  console.log(exp, "exp");

  // handle add/update image
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImages(imageList);
  };

  // err validations
  useEffect(() => {
    const err = [];
    let imageFiles = images?.map((img) => img.file);
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
    await uploadImages(rvwId, imageFiles);
    history.push(`/experiences/${expId}`);
  };

  // send image files to thunk
  const uploadImages = async (rvwId, imageFiles) => {
    for (let i = 0; i < imageFiles.length; i++) {
      let img = imageFiles[i];

      const newRvwImage = {
        file: img,
        review_id: rvwId,
        newFile: true,
      };

      const { review_id, file, newFile } = newRvwImage;

      const form = new FormData();

      form.append("file", file);
      form.append("review_id", review_id);
      form.append("newFile", newFile);

      await dispatch(uploadRvwImage(rvwId, form));
    }
  };

  return (
    <div className="dd-img-div">
      <br></br>
      <br></br>
      <div className="exp-details">Upload Review Images</div>
      <br></br>
      <br></br>
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
              Drag & Drop to Upload Files*
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
      <form className="upload-rvw-form" onSubmit={handleSubmit}>
        <button className="new-img-submit" type="submit">
          Submit
        </button>
        <div>*(Max 6)</div>
      </form>
    </div>
  );
}

export default UploadReviewImage2;
