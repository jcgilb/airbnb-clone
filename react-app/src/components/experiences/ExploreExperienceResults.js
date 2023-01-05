import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSearchResults } from "../../context/SearchResultsContext";
import "./ExploreExp.css";
import "../search/SearchResults.css";

const ExploreExperienceResults = () => {
  const history = useHistory();

  const { searchResults, setSearchResults } = useSearchResults();
  const [expArr, setExpArr] = useState(searchResults);

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

  if (!searchResults)
    return (
      <div className="search-results-container">
        <div className="container">
          <br></br>
          <br></br>
          <div className="explore-title">{"No Results"}</div>
          <br></br>
        </div>
      </div>
    );

  return (
    <div className="search-results-container">
      <div className="container">
        <br></br>
        <br></br>
        <div className="explore-title">{"Search Results"}</div>
        <br></br>

        <div className="flex-row-wrap">
          {searchResults?.map((exp) => (
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
export default ExploreExperienceResults;
