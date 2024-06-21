import React from 'react';

const SortButtons = ({ sortShows, onSortChange, onClear }) => {
  return (
    <div className="sort-shows-div">
      <button 
        className={`sort-button ${sortShows === "A-Z" ? "selected-sort-button" : ""}`} 
        onClick={() => onSortChange("A-Z")}
      >
        A-Z
      </button>
      <button 
        className={`sort-button ${sortShows === "Z-A" ? "selected-sort-button" : ""}`} 
        onClick={() => onSortChange("Z-A")}
      >
        Z-A
      </button>
      <button 
        className={`sort-button ${sortShows === "Newest" ? "selected-sort-button" : ""}`} 
        onClick={() => onSortChange("Newest")}
      >
        Newest
      </button>
      <button 
        className={`sort-button ${sortShows === "Oldest" ? "selected-sort-button" : ""}`} 
        onClick={() => onSortChange("Oldest")}
      >
        Oldest
      </button>
      {sortShows && (
        <button
          onClick={onClear}
          className="clear-button"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SortButtons;