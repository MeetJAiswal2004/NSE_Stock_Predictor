// frontend/src/components/SearchBar.jsx
import React, { useState } from 'react';
function SearchBar({ onSearch, isResponseVisible }) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); 
    if (!inputValue.trim()) {
        alert("Please enter a stock name.");
        return;
    }
    onSearch(inputValue);
  };

  return (
    
    <div id="centerBox" className={`center-container ${isFocused || inputValue || isResponseVisible ? 'top-fixed' : ''}`}>
      <h1>Engineered to <span className="gradient-text">Predict</span></h1>
      
      <form id="stockForm" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            name="company"
            id="companyInput"
            placeholder=" "
            required
            value={inputValue}             // Connect input to state
            onChange={handleInputChange}   // Update state on typing
            onFocus={() => setIsFocused(true)}   // Set focus to true
            onBlur={() => setIsFocused(false)}    // Set focus to false
          />
          <span className="fake-placeholder">Enter Stock Name</span>
          <button className={`arrow-button ${inputValue ? 'rotate' : ''}`} id="arrowBtn" type="submit">
            &#9650;
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;