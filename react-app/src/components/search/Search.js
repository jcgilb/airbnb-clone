import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { getAllExperiences } from "../../store/experiences";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useSearchResults } from "../../context/SearchResultsContext";

function Search() {
  const history = useHistory();
  const dispatch = useDispatch();
  const navigate = useLocation();

  const { searchResults, setSearchResults } = useSearchResults();
  const [search, setSearch] = useState();

  useEffect(() => {
    dispatch(getAllExperiences());
  }, [dispatch]);

  const experiences = useSelector((state) => state.experiences.experiences);
  const expArr = Object.values(experiences);
  const keywordList = {};

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
    <div className="App">
      <header className="App-header">
        <div style={{ width: 400 }}>
          <ReactSearchAutocomplete
            searchResults={searchResults}
            items={items}
            onSearch={(e) => setSearchResults(e)}
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
