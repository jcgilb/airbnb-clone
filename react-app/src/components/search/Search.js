import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExperiences } from "../../store/experiences";

function Search({ exp, expId, slot }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllExperiences());
  }, [dispatch]);

  const experiences = useSelector((state) => state.experiences.experiences);
  const expArr = Object.values(experiences);

  const [target, setTarget] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        ></input>
      </form>
      <div className="dropdown-options"></div>
    </div>
  );
}

export default Search;
