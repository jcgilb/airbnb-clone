// import React, { useState, useCallback } from "react";
// import {
//   GoogleMap,
//   useJsApiLoader,
//   Marker,
//   InfoWindow,
// } from "@react-google-maps/api";

// import Geocode from "react-geocode";
// import Search from "./Search";
// const libraries = ["places"];

// const Gaming = () => {
//   // const [address, setAddress] = useState("11086 Raleigh Ct., Westminster, CO 80031");
//   const markers = [
//     {
//       id: 1,
//       name: "Chicago, Illinois",
//       position: { lat: 41.881832, lng: -87.623177 },
//     },
//     {
//       id: 2,
//       name: "Denver, Colorado",
//       position: { lat: 39.739235, lng: -104.99025 },
//     },
//     {
//       id: 3,
//       name: "Los Angeles, California",
//       position: { lat: 34.052235, lng: -118.243683 },
//     },
//     {
//       id: 4,
//       name: "New York, New York",
//       position: { lat: 40.712776, lng: -74.005974 },
//     },
//   ];
//   //This sets the center of the map. This must be set BEFORE the map loads

//   const [currentPosition, setCurrentPosition] = useState({
//     lat: 43.11016617798622,
//     lng: -89.48826131670266,
//   });

//   // This is the equivalent to a script tag

//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
//   });

//   const containerStyle = {
//     width: "800px",
//     height: "800px",
//   };

//   const [map, setMap] = useState(null);

//   const onUnmount = useCallback(function callback(map) {
//     setMap(null);
//   }, []);

//   Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API);
//   console.log(process.env.REACT_APP_GOOGLE_MAPS_API);
//   // set response language. Defaults to english.
//   Geocode.setLanguage("en");

//   Geocode.setLocationType("ROOFTOP");

//   // Enable or disable logs. Its optional.
//   Geocode.enableDebug();

//   // Get latitude & longitude from address
//   const makeMap = (e) => {
//     e.preventDefault();
//     Geocode.fromAddress("Eiffel Tower").then(
//       (response) => {
//         const { lat, lng } = response.results[0].geometry.location;
//         setCurrentPosition({ lat, lng });
//       },
//       (error) => {
//         console.error(error);
//       }
//     );
//   };
//   // Get address from latitude & longitude.
//   Geocode.fromLatLng("48.8583701", "2.2922926").then(
//     (response) => {
//       const address = response.results[0].formatted_address;
//       console.log(address);
//     },
//     (error) => {
//       console.error(error);
//     }
//   );

//   return (
//     // Important! Always set the container height explicitly

//     <div className="map_page__container">
//       <div style={{ height: "900px", width: "900px" }}>
//         {isLoaded && currentPosition ? (
//           <>
//             <Search />
//             <GoogleMap
//               libraries={libraries}
//               mapContainerStyle={containerStyle}
//               zoom={12}
//               center={currentPosition}
//               onUnmount={onUnmount}
//             >
//               {markers.map((marker) => (
//                 <>
//                   {/* <GooglePlacesInput /> */}
//                   <Marker
//                     key={marker.id}
//                     position={{
//                       lat: marker.position.lat,
//                       lng: marker.position.lng,
//                     }}
//                     icon={{
//                       path: "M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",
//                       fillColor: marker.color,
//                       fillOpacity: 1,
//                       scale: 0.2,
//                       strokeColor: "gold",
//                       strokeWeight: 2,
//                     }}
//                     streetView={false}
//                   >
//                     <InfoWindow
//                       position={{
//                         lat: marker.position.lat,
//                         lng: marker.position.lng,
//                       }}
//                     >
//                       <div>
//                         <span>{marker.name}</span>
//                       </div>
//                     </InfoWindow>
//                   </Marker>
//                 </>
//               ))}
//             </GoogleMap>
//           </>
//         ) : null}
//         {/* {isLoaded && (
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             zoom={8}
//             center={currentPosition}
//             onUnmount={onUnmount}
//           ></GoogleMap>
//         )} */}
//       </div>
//     </div>
//   );
// };

// export default Gaming;
