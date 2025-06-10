import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundsearch from "../../../public/backgorundsearch.webp";
import Spinner from "../Common/Spinner";
function ViewProperty() {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const queryParams = new URLSearchParams(location.search);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const locationQuery = queryParams.get("location") || "default location";
        const bedrooms = queryParams.get("bedroom")
          ? queryParams.get("bedroom").split(",")
          : [];
        const propertyType = queryParams.get("propertyType")
          ? queryParams.get("propertyType").split(",")
          : [];
        const budgetType = queryParams.get("budgetType") || "Rent";
        const budget = queryParams.get("budget") || "";

        const query = `?location=${encodeURIComponent(
          locationQuery
        )}&bedroom=${encodeURIComponent(
          bedrooms.join(",")
        )}&propertyType=${encodeURIComponent(
          propertyType.join(",")
        )}&budgetType=${budgetType}&budget=${encodeURIComponent(budget)}`;

        const response = await axios.post(
          `${import.meta.env.VITE_SERVER}/api/v1/sear/search${query}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLoading(false);

        if (response.data) {
          setProperties(response.data.data);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [location.search, token]);

  if (loading)
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 bg-opacity-50 flex justify-center items-center z-50">
        <Spinner />
      </div>
    
    );

  return (
    <div
      className="min-h-screen py-12 px-[15%]"
      style={{
        backgroundImage: `url(${backgroundsearch})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", 
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
          Properties for Rent
        </h1>
        {properties.length > 0 ? (
          <div className="space-y-8">
            {properties.map((property) => (
              <div
              key={property._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl h-[50vh] flex"
              style={{ width: "120%", transform: "translateX(-10%)" }}>
                <div className="w-1/3">
                  <img
                    src={property.images[0] || "https://via.placeholder.com/800x400"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-blue-900">
                        {property.title}
                      </h2>
                      <p className="text-lg font-bold text-blue-600">
                        ₹{property.price.amount} / {property.price.type}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {property.address.street}, {property.address.city},{" "}
                      {property.address.state}, {property.address.country}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-sm text-gray-700">
                      <div className="text-center">
                        <p className="font-bold">{property.bedrooms}</p>
                        <p className="text-gray-600">Beds</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{property.bathrooms}</p>
                        <p className="text-gray-600">Baths</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{property.area} sqft</p>
                        <p className="text-gray-600">Area</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <strong className="block text-sm text-gray-700 mb-2">
                        Amenities:
                      </strong>
                      <ul className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, index) => (
                          <li
                            key={index}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                          >
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <strong className="block text-sm text-gray-700 mb-1">
                        Address Details:
                      </strong>
                      <p className="text-xs text-gray-600">
                        {property.address.street},{" "}
                        {property.address.district && property.address.district + ", "}
                        {property.address.city}, {property.address.state},{" "}
                        {property.address.country} - {property.address.postalCode}
                      </p>
                      {property.address.landmark && (
                        <p className="text-xs text-gray-500">
                          Landmark: {property.address.landmark}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/view-s-properties/${property._id}`)}
                    className="mt-4 bg-blue-600 text-white w-full py-2 rounded-md shadow-md hover:bg-blue-700 transition-all"
                  >
                    More Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No properties found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
}

export default ViewProperty;
