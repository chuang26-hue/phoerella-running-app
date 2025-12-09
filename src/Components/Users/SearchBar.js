// src/Components/Home/SearchBar.js
import React from "react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <input
        type="text"
        placeholder="Search for runners by name or username..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "12px 20px",
          fontSize: "16px",
          border: "2px solid #ddd",
          borderRadius: "25px",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#007bff")}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />
    </div>
  );
};

export default SearchBar;
