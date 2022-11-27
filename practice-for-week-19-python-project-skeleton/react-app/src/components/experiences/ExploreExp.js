import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import {
  getAllExperiences,
  getOneExperience,
} from "../../store/experiences.js";
import "./ExploreExp.css";

const ExploreExperiences = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const experiences = useSelector((state) => state.experiences);
  const allExperiences = Object.values(experiences);
  const expArr = allExperiences.slice(0, allExperiences.length - 1);
  console.log(expArr, "experiences array");

  useEffect(() => {
    dispatch(getAllExperiences());
  }, [dispatch]);

  const getPreviewImage = (exp) => {
    let image = exp["images"]?.find((img) => img.preview == false);
    console.log(image?.image_url, "image");
    return <img className="exp-img" alt={exp.id} src={image?.image_url}></img>;
  };

  const getExpDetails = (id) => {
    history.push(`/experiences/${id}`);
  };

  const getAvgStars = (exp) => {
    // TODO: get avg star rating
    // TODO: get total num reviews
  };

  return (
    <div className="container">
      <div className="explore-title">{"All Experiences"}</div>
      <div className="flex-row-wrap">
        {expArr?.map((exp) => (
          <>
            <div className="exp-card">
              <div key={"image"} onClick={() => getExpDetails(exp.id)}>
                {getPreviewImage(exp)}
              </div>
              <div key={exp.id} onClick={() => getExpDetails(exp.id)}>
                {exp?.name}
              </div>
              <div key={exp.price} onClick={() => getExpDetails(exp.id)}>
                {"Price: $"}
                {exp?.price}/person
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};
export default ExploreExperiences;
