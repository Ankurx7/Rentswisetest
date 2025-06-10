import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../Common/Spinner";
import { FiSearch, FiChevronDown, FiHome, FiBriefcase, FiMapPin, FiCheck } from "react-icons/fi";
import "../../App.css";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [transactionType, setTransactionType] = useState("Rent");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);
  const cityDropdownRef = useRef(null);

  const topCities = ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Pune", "Gurgaon", "Patna"];

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim() !== "") {
      setSuggestionsLoading(true);
      setSuggestionsError(null);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            `${value}, ${selectedCity}`
          )}&format=json&addressdetails=1&limit=5&countrycodes=IN`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions", error);
        setSuggestionsError("Error fetching suggestions. Please try again.");
      } finally {
        setSuggestionsLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a valid search query.");
      return;
    }
   
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to search properties.");
      return;
    }
    try {
      const locationDetails = selectedSuggestion || { display_name: searchQuery };
      const queryString = `/view-properties?location=${encodeURIComponent(
        locationDetails.display_name
      )}&propertyType=${encodeURIComponent(propertyType)}&transactionType=${encodeURIComponent(transactionType)}`;
      navigate(queryString);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Unauthorized. Please login to search properties.");
      } else {
        setError(err.response?.data?.message || "An error occurred while searching.");
      }
    }
  };

  const handleClickOutside = (e) => {
    if (!suggestionsRef.current?.contains(e.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleCityClickOutside = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleCityClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleCityClickOutside);
    };
  }, []);

  const propertyTypes = ["Apartment", "Villa", "PG/Hostel", "Commercial"];

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-4 md:mt-8">
      <div className="flex pb-2 space-x-2 mb-4 px-2 overflow-x-auto hide-scrollbar">
        {propertyTypes.map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium flex items-center transition-all duration-300 ${
              propertyType === type
                ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setPropertyType(type)}
          >
            {type === "PG/Hostel" ? <FiBriefcase className="mr-2" /> : <FiHome className="mr-2" />}
            {type}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center bg-white shadow-xl rounded-2xl p-2 space-y-2 md:space-y-0 md:space-x-2 mx-2 border border-gray-100 hover:border-blue-200 transition-all duration-300">
      
        <div ref={cityDropdownRef} className="w-full md:w-1/5 relative group">
          <div 
            className="flex items-center px-4 py-3 bg-gray-50 rounded-xl md:rounded-full border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
          >
            <FiMapPin className="text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">{selectedCity}</span>
            <FiChevronDown className={`text-gray-500 ml-2 transition-transform ${isCityDropdownOpen ? "rotate-180" : ""}`} />
          </div>
          {isCityDropdownOpen && (
            <div className="absolute z-[9999] w-full mt-2 bg-white shadow-lg rounded-xl overflow-visible border border-gray-100 animate-slideDown">
              {topCities.map((city, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    city === selectedCity
                      ? "bg-gradient-to-r from-blue-50 to-cyan-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsCityDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <FiMapPin className={`mr-2 ${city === selectedCity ? "text-blue-600" : "text-gray-500"}`} />
                    <span className={`text-sm ${city === selectedCity ? "text-blue-700 font-semibold" : "text-gray-700"}`}>
                      {city}
                    </span>
                    {city === selectedCity && <FiCheck className="ml-auto text-blue-600" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="relative flex-1 w-full">
          <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl md:rounded-full border border-gray-200 hover:border-blue-400 transition-colors">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
              placeholder={`Search in ${selectedCity}...`}
              value={searchQuery}
              onChange={handleInputChange}
            />
          </div>
          {(suggestions.length > 0 || suggestionsLoading || suggestionsError) && (
            <div ref={suggestionsRef} className="absolute z-[1000] w-full bg-white shadow-lg mt-2 rounded-xl overflow-hidden border border-gray-100">
              {suggestionsLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600"></div>
                </div>
              ) : suggestionsError ? (
                <div className="p-4 text-center text-red-600 text-sm">{suggestionsError}</div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <p className="text-sm text-gray-700 truncate">{suggestion.display_name}</p>
                    <p className="text-xs text-gray-500 mt-1">{suggestion.type}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="flex items-center bg-gray-50 rounded-xl md:rounded-full p-1 border border-gray-200">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              transactionType === "Rent"
                ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setTransactionType("Rent")}
          >
            Rent
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              transactionType === "Sale"
                ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setTransactionType("Sale")}
          >
            Sale
          </button>
        </div>
     
        <button
          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white rounded-xl md:rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
          onClick={handleSearch}
        >
          <FiSearch className="mr-2" />
          Search
        </button>
      </div>
    
      {error && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
