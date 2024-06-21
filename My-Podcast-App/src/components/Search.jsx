import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./CSS/Search.css";

const Search = ({ onSearch }) => {
  const [searchPhrase, setSearchPhrase] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchPhrase(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="search-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchPhrase}
        onChange={handleInputChange}
        aria-label="Search"
      />
    </div>
  );
};

export default Search;
