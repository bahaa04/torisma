import React from 'react';

const Search = () => {
  return (
   

  <div className="search-container">
  <div className="search-bar">
    <div className="search-input-container">
      <div className="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <input type="text" className="search-input" placeholder="Vous tapez la wilaya où vous voulez aller"/>
    </div>
    <button className="search-button">Search</button>
  </div>
  </div>

  );
};

export default Search;