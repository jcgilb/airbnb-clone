import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllExperiences } from "../../store/experiences";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useSearchResults } from "../../context/SearchResultsContext";

function Search() {
  const history = useHistory();
  const dispatch = useDispatch();

  const experiences = useSelector((state) => state.experiences.experiences);
  const keywordList = {};

  const { searchResults, setSearchResults } = useSearchResults();
  const [expArr, setExpArr] = useState(Object.values(experiences));

  useEffect(() => {
    dispatch(getAllExperiences());
  }, [dispatch]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/experiences");
      const responseData = await response.json();
      setExpArr(responseData);
    }
    fetchData();
  }, []);

  expArr.map((exp, i) => {
    // cities
    if (keywordList[exp.city]) {
      keywordList[exp.city].push(exp);
    }
    if (!keywordList[exp.city]) {
      keywordList[exp.city] = [exp];
    }
    // addresses
    if (keywordList[exp.address]) {
      keywordList[exp.address].push(exp);
    }
    if (!keywordList[exp.address]) {
      keywordList[exp.address] = [exp];
    }
    // countries
    if (keywordList[exp.country]) {
      keywordList[exp.country].push(exp);
    }
    if (!keywordList[exp.country]) {
      keywordList[exp.country] = [exp];
    }
    // hosts
    if (keywordList[exp.exp_host.first_name]) {
      keywordList[exp.exp_host.first_name].push(exp);
    }
    if (!keywordList[exp.exp_host.first_name]) {
      keywordList[exp.exp_host.first_name] = [exp];
    }
    // names
    if (keywordList[exp.name]) {
      keywordList[exp.name].push(exp);
    }
    if (!keywordList[exp.name]) {
      keywordList[exp.name] = [exp];
    }
  });

  let keys = Object.keys(keywordList);
  let values = Object.values(keywordList);

  let items = keys.map((key, i) => {
    let obj = {
      id: i,
      name: key,
      exps: values[i],
    };
    return obj;
  });

  const handleOnSelect = (item) => {
    // the item selected
    setSearchResults(item.exps);
    return history.push(`/experiences/results`);
  };

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
      </>
    );
  };

  if (!experiences) return null;
  return (
    <div className="search-container">
      <header className="search-header">
        <div style={{ width: 400 }}>
          <ReactSearchAutocomplete
            searchResults={searchResults}
            items={items}
            // onSearch={(e) => setSearchResults(e)}
            onSelect={handleOnSelect}
            autoFocus
            formatResult={formatResult}
          />
        </div>
      </header>
    </div>
  );
}

export default Search;
