import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { FileUploader } from "react-drag-drop-files";
import ImageUploading from "react-images-uploading";
import { uploadRvwImage } from "../../store/images.js";

function UploadReviewImage({ rvw, setImageFile, imageFile }) {
  // const user = useSelector((state) => state.session.user);
  // const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState("");
  const allowedExt = ["HEIC", " JPEG", "JPG", "PNG", "jpeg", "jpg", "png"];

  const dispatch = useDispatch();
  const history = useHistory();

  // parse exp id from url
  let { expId } = useParams();
  expId = parseInt(expId);

  // const setFile = (file) => {
  //   setImageUrl(file);
  //   setImageFile(file);
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (imageUrl) {
  //     // const formData = new FormData();
  //     // formData.append("review_id", rvw.id);
  //     // formData.append("image_url", imageUrl);
  //     // console.log(formData, "formData");
  //     // let rvwImage = await dispatch(uploadRvwImage(rvw.id, formData));

  //     let newRvwImage = { review_id: rvw.id, image_url: imageUrl };
  //     console.log("newRvwImage", newRvwImage);
  //     let rvwImage = await dispatch(uploadRvwImage(rvw.id, newRvwImage));
  //     console.log(rvwImage, "promise");
  //     if (rvwImage) {
  //       history.push(`/experiences/${expId}`);
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = image[0].file;

    console.log("image in handleSubmit", imageUrl);
    console.log("rvw.id", rvw.id);

    await addImages(imageUrl, rvw.id);
    window.alert("Success");
    history.push(`/experiences/${expId}`);
  };

  const addImages = async (imageUrl, id) => {
    const obj = {
      file: imageUrl,
      review_id: id,
      newFile: true,
    };
    console.log("obj", obj);

    await dispatch(uploadRvwImage(id, obj));
  };

  return (
    <>
      <div className="dd-img-div"></div>
      <form className="upload-rvw-form" onSubmit={handleSubmit}>
        <div className="dd-area">
          {/* <FileUploader
            className="file-uploader"
            handleChange={(file) => setFile(file)}
            name="imageUrl"
            types={allowedExt}
          >
            <div className="dd-div">Drag and drop or upload an image</div>
          </FileUploader> */}

          <ImageUploading
            multiple={false}
            value={image}
            onChange={(file) => setImage(file)}
            maxNumber={20}
            dataURLKey="data_url"
            acceptType={["jpg", "png", "jpeg"]}
          >
            {({ onImageUpload, isDragging, dragProps }) => (
              <div className="upload__image-wrapper">
                <div
                  style={isDragging ? { color: "rgb(192, 53, 22)" } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                  className="add_images_container"
                >
                  Click or Drag Images Here
                </div>
                {/* <div onClick={onImageRemoveAll}>Remove all images</div> */}
                <div className="images_container">
                  <img src={image["data_url"]} alt="" height="230" />
                </div>
              </div>
            )}
          </ImageUploading>
        </div>
        <button className="new-comment" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}

export default UploadReviewImage;
