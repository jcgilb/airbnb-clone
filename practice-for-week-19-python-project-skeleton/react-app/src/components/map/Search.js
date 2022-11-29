import React, { useState, useRef } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
const libraries = ["places"];

const Search = () => {
  const [value, setValue] = useState(null);
  const placesRef = useRef();
  const getAddress = () => {
    console.log(placesRef.current?.getAddressText());
  };

  return (
    <div>
      <GooglePlacesAutocomplete
        ref={placesRef}
        libraries={libraries}
        fetchDetails={true}
        onPress={(data, details = null) => console.log(data, details)}
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log("no results")}
        apiKey="process.env.REACT_APP_GOOGLE_MAPS_API"
        // query={{
        //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
        //   components: "country:us",
        // }}
        selectProps={{
          value,
          onChange: setValue,
        }}
      />
    </div>
  );
};
export default Search;
