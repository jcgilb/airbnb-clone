import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllExperiences } from "../store/experiences";
import "./LandingPage.css";

const LandingPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [pos, setPos] = useState(0);

  const experiences = useSelector((state) => state.experiences.experiences);
  const [expArr, setExpArr] = useState(Object.values(experiences));
  // const lastThree = expArr.slice(expArr.length - 3, expArr.length);

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
          e.target.src = "../../assets/default-image-localXP.jpg";
        }}
        className="splash-experience-img"
        alt={exp.id}
        src={
          !image?.image_url
            ? "../../../assets/default-image-localXP.jpg"
            : image?.image_url
        }
      ></img>
    );
  };

  const getFirstImageAgain = (exp) => {
    let image;
    if (exp["images"]?.length) {
      image = exp["images"][0];
    }
    return (
      <img
        onError={(e) => {
          e.target.src = "../../assets/default-image-localXP.jpg";
        }}
        className="small-experience-img"
        alt={exp.id}
        src={
          !image?.image_url
            ? "../../../assets/default-image-localXP.jpg"
            : image?.image_url
        }
      ></img>
    );
  };

  const getExpDetails = (id) => {
    history.push(`/experiences/${id}`);
  };

  const updatePos = (newPos) => {
    if (newPos < 0) {
      newPos = 0;
    } else if (newPos >= expArr.length) {
      newPos = expArr.length - 1;
    }

    setPos(newPos);
  };

  const getAvgStars = (exp) => {
    // TODO: get avg star rating
    // TODO: get total num reviews
  };

  return (
    <div className="container">
      <br />
      <br />
      <div clasName="top-row">
        <div className="latest-exp">
          <div className="splash-explore-title">
            Unforgettable activities hosted by locals
          </div>
          <div className="exp-carousel">
            {pos > 0 && (
              <i
                className="fa-solid fa-chevron-left"
                onClick={() => updatePos(pos - 0.5)}
              ></i>
            )}
            <div
              style={{ transform: `translateX(-${pos * 100}%)` }}
              className="flex-row"
            >
              {expArr?.reverse().map((exp) => (
                <div className="splash-exp-card">
                  <div key={"image"} onClick={() => getExpDetails(exp.id)}>
                    {getFirstImage(exp)}
                  </div>
                  <div key={exp.id} onClick={() => getExpDetails(exp.id)}>
                    {exp?.name}
                  </div>
                  <div key={exp.price} onClick={() => getExpDetails(exp.id)}>
                    {"Price: $"}
                    {exp?.price}/person
                  </div>
                </div>
              ))}
            </div>
            {pos < expArr?.length - 4 && (
              <i
                className="fa-solid fa-chevron-right"
                onClick={() => updatePos(pos + 0.5)}
              ></i>
            )}
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="explore-title">Browse Experiences</div>
      <br />
      <br />
      <div className="flex-row-wrap">
        {expArr.map((exp) => (
          <div className="small-exp-card">
            <div
              className="exp-info"
              key={"image"}
              onClick={() => getExpDetails(exp.id)}
            >
              {getFirstImageAgain(exp)}
            </div>
            <div
              className="exp-info"
              key={exp.id}
              onClick={() => getExpDetails(exp.id)}
            >
              {exp?.name}
            </div>
            <div
              className="exp-info"
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

export default LandingPage;
