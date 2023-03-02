import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Geocode from "react-geocode";

const Map = ({ exp }) => {
  const [address, setAddress] = useState("Denver");

  //This sets the center of the map. This must be set BEFORE the map loads

  const [currentPosition, setCurrentPosition] = useState({
    lat: 43.11016617798622,
    lng: -89.48826131670266,
  });

  // This is the equivalent to a script tag

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.MAPS_API_KEY,
  });

  const containerStyle = {
    width: "800px",
    height: "800px",
  };

  const [map, setMap] = useState(null);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  //This is of course not the raw key but either from getting it from the backend and storing it in redux or in your frontend .env
  Geocode.setApiKey(process.env.MAPS_API_KEY);

  // set response language. Defaults to english.
  Geocode.setLanguage("en");

  Geocode.setLocationType("ROOFTOP");

  // Enable or disable logs. Its optional.
  Geocode.enableDebug();

  // Get latitude & longitude from address
  const makeMap = (e) => {
    e.preventDefault();
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setCurrentPosition({ lat, lng });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    // Important! Always set the container height explicitly

    <div className="map_page__container">
      <div style={{ height: "900px", width: "900px" }}>
        {isLoaded && currentPosition ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={12}
            center={currentPosition}
            onUnmount={onUnmount}
          >
            <>
              <Marker
                key={exp.id}
                position={{ lat: exp?.lat, lng: exp?.lng }}
                icon={{
                  path: "M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",
                  fillColor: "blue",
                  fillOpacity: 1,
                  scale: 0.2,
                  strokeColor: "gold",
                  strokeWeight: 2,
                }}
                streetView={false}
              ></Marker>
            </>
          </GoogleMap>
        ) : null}
      </div>
    </div>
  );
};

export default Map;
