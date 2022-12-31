import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import ImageUploading from "react-images-uploading";
import { uploadRvwImage, deleteRvwImage } from "../../store/images.js";
import { getAllReviews } from "../../store/reviews.js";

function UploadReviewImage({ rvw, setImageFile, imageFile }) {
  const [image, setImage] = useState("");
  const [list, setList] = useState();
  const [errors, setErrors] = useState([]);
  // const allowedExt = ["HEIC", " JPEG", "JPG", "PNG", "jpeg", "jpg", "png"];

  const dispatch = useDispatch();
  const history = useHistory();

  // parse exp id from url
  let { expId } = useParams();
  expId = parseInt(expId);

  // state objs
  const user = useSelector((state) => state.session.user);
  const rvwImages = useSelector((state) => state.images.rvwImages);
  const reviews = useSelector((state) => state.reviews.reviews);
  const rvwImgArr = Object.values(rvwImages);

  useEffect(() => {
    dispatch(getAllReviews(expId));
  }, [reviews]);

  // handle add/update image
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImage(imageList[0]);
    setImageFile({ addUpdateIndex: imageList[0] });
    console.log("setting image file", imageFile);
  };

  // err validations
  useEffect(() => {
    const err = [];
    // limit image file size to 1MB => 1,000,000 bites
    if (image[0]?.file.size > 1000000) err.push("Limit image size to 1MB.");
    setErrors(err);
  }, []);

  // handle form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("image", image);
    let imageFile = image?.file;
    console.log("imgFile", imageFile);

    const newRvwImage = {
      file: imageFile,
      review_id: rvw.id,
      newFile: true,
    };

    let upload = await dispatch(uploadRvwImage(rvw.id, newRvwImage));
    if (upload) {
      return history.push(`/experiences/${expId}`);
    }

    // let uploads = await uploadImages(rvw, imageFiles);
    // alert("Success");
    // return history.push(`/experiences/${expId}`);
  };

  // const uploadImages = async (rvw, imageFiles) => {
  //   for (let img of imageFiles) {
  //     const newRvwImage = {
  //       file: img,
  //       review_id: rvw.id,
  //       newFile: true,
  //     };
  //     let upload = await dispatch(uploadRvwImage(rvw.id, newRvwImage)).catch(
  //       async (res) => {
  //         const data = await res.json();
  //         if (data && data.errors) setErrors(data.errors);
  //       }
  //     );
  //   }
  // };

  return (
    <>
      <div className="dd-img-div"></div>
      <form className="upload-rvw-form" onSubmit={handleSubmit}>
        <div className="dd-area">
          <ImageUploading
            multiple
            value={image}
            onChange={onChange}
            maxNumber={1}
            maxFileSize={1000000}
            dataURLKey="data_url"
            acceptType={["jpg", "png", "jpeg"]}
          >
            {({
              image,
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              <div className="upload__image-wrapper">
                <button
                  style={isDragging ? { color: "red" } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                  className="add-img-container"
                >
                  Click or Drop here
                </button>
                &nbsp;
                <ul className="errors">
                  {errors.length > 0 &&
                    errors.map((err) => (
                      <div id="err" key={err}>
                        {err}
                      </div>
                    ))}
                </ul>
                {imageList?.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image["data_url"]} alt="" width="100" />
                    <div className="images-to-submit">
                      <button onClick={() => onImageUpdate(index)}>
                        Update
                      </button>
                      <button
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
            )}
          </ImageUploading>
        </div>
        <button className="new-img-submit" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default UploadReviewImage;
