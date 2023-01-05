import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const UserExperiences = () => {
  const history = useHistory();

  const experiences = useSelector((state) => state.experiences.experiences);
  const user = useSelector((state) => state.session.user);
  const [expArr, setExpArr] = useState(Object.values(experiences));

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/users/${user?.id}/experiences`);
      const responseData = await response.json();
      setExpArr(responseData);
    }
    fetchData();
  }, [user]);

  // useEffect(() => {
  //   setExpArr(searchResults);
  // }, [searchResults]);

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

  if (!expArr.length) {
    return (
      <div className="search-results-container">
        <div className="container">
          <br></br>
          <br></br>
          <div className="explore-title">{"No Experiences (yet)"}</div>
          <div
            onClick={() => history.push("/experiences/new")}
            className="top create-exp"
          >
            Host an experience
          </div>
          <br></br>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="container">
        <br></br>
        <br></br>
        <div className="explore-title">{"My Experiences"}</div>
        <br></br>

        <div className="flex-row-wrap">
          {expArr?.map((exp) => (
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
    </div>
  );
};
export default UserExperiences;
