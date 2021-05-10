import React from "react";

const SavedLocations = ({ data, deleteLocation, openLocation }) => {



  return data.map((location) => {

    

    return (
      <div key={location.city + location.country} className="saved-locations">
        <div className="text-close">
          <div className="saved-location-text" onClick={()=>{openLocation(location)}}>
            <span className="saved-location-city">{location.city}</span> | {location.country}
          </div>
          <span className="close-icon" onClick={()=>{deleteLocation(location)}}>
            <i className="times circle icon"></i>
          </span>
        </div>
      </div>
    );
  });
};

export default SavedLocations;
