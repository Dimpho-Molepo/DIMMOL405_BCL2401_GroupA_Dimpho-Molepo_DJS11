import React from "react";
import { FaSearch } from "react-icons/fa";
import "./CSS/Search.css";

const Search = () => {
 

  return (
    <div className="search-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchPhrase}
        aria-label="Search"
      />
    </div>
  );
};

export default Search;
