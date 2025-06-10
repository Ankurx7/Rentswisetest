import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../Common/Spinner"; 

const ViewSProperty = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/prop/getData/${propertyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setProperty(response.data.property);
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError(err.response?.data?.message || err.message || "An error occurred while fetching property data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    if (property && property.images && currentSlide < property.images.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 relative">
      
      {loading && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}

   
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

      {!loading && !error && !property && (
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-gray-700">Property not found.</p>
        </div>
      )}

      {!loading && property && (
        <div className="container mx-auto bg-white rounded-lg shadow-lg p-6">
        
          <div className="relative w-full h-96 mb-6">
            {property.images && property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentSlide]}
                  alt={`Property Image ${currentSlide + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
      
                {currentSlide > 0 && (
                  <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
             
                {currentSlide < property.images.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
             
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full ${
                        currentSlide === index ? "bg-white" : "bg-gray-400"
                      }`}
                    ></button>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-300 flex justify-center items-center rounded-lg">
                <span className="text-gray-700">No Image Available</span>
              </div>
            )}
          </div>

        
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{property.title}</h1>
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-blue-600">
              ₹{property.price.amount} {property.price.type === "Rent" ? "/month" : ""}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {property.propertyType}
            </span>
          </div>
          <p className="text-gray-700 mb-6">{property.description}</p>

      
          <div className="border-t pt-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Address</h3>
            <p className="text-gray-600 mt-1">
              {property.address.street},{" "}
              {property.address.district && property.address.district + ", "}
              {property.address.city}, {property.address.state},{" "}
              {property.address.country} - {property.address.postalCode}
            </p>
            {property.address.landmark && (
              <p className="text-gray-500 text-sm">
                Landmark: {property.address.landmark}
              </p>
            )}
          </div>

       
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{property.bedrooms}</p>
                <p className="text-gray-600">Bedrooms</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{property.bathrooms}</p>
                <p className="text-gray-600">Bathrooms</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{property.area} sqft</p>
                <p className="text-gray-600">Area</p>
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {property.listedBy && (
            <div className="border-t pt-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Contact Details</h3>
              <p className="text-gray-600">
                <strong>Name:</strong> {property.listedBy.name}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {property.listedBy.email}
              </p>
              {property.listedBy.phone && (
                <p className="text-gray-600">
                  <strong>Phone:</strong> {property.listedBy.phone}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewSProperty;
