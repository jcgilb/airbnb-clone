import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./ExploreExp.css";

const ExploreExperienceResults = () => {
  const history = useHistory();

  const experiences = useSelector((state) => state.experiences.experiences);
  const [expArr, setExpArr] = useState(Object.values(experiences));

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/experiences");
      const responseData = await response.json();
      setExpArr(responseData);
    }
    fetchData();
  }, []);

  const getFirstImage = (exp) => {
    let image;
    if (exp["images"]?.length) {
      image = exp["images"][0];
    }
    return (
      <img
        onError={(e) => {
          e.target.src = "../../assets/default-image-localXP.png";
        }}
        className="experience-img"
        alt={exp.id}
        src={
          !image?.image_url
            ? "../../../assets/default-image-localXP.png"
            : image?.image_url
        }
      ></img>
    );
  };

  const getExpDetails = (id) => {
    history.push(`/experiences/${id}`);
  };

  // const getAvgStars = (exp) => {
  //   // TODO: get avg star rating
  //   // TODO: get total num reviews
  // };

  return (
    <div className="container">
      <br></br>
      <br></br>
      <div className="explore-title">{"All Experiences"}</div>
      <br></br>

      <div className="flex-row-wrap">
        {expArr.map((exp) => (
          <div className="exp-card">
            <div
              className="explore-card"
              key={"image"}
              onClick={() => getExpDetails(exp.id)}
            >
              {getFirstImage(exp)}
            </div>
            <div
              className="explore-card"
              key={exp.id}
              onClick={() => getExpDetails(exp.id)}
            >
              {exp?.name}
            </div>
            <div
              className="explore-card"
              key={exp.price}
              onClick={() => getExpDetails(exp.id)}
            >
              {"Price: $"}
              {exp?.price}/person
            </div>
          </div>
        ))}
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};
export default ExploreExperienceResults;
