import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Common/Spinner'; 
import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GetRecentAdd = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);          
  const [detailsLoading, setDetailsLoading] = useState(false); 
  const [error, setError] = useState(null);                   
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRecentProperties = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/prop/getRecentData`);
        setProperties(response.data.properties);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProperties();
  }, []);


  const handleViewDetails = async (propertyId) => {
    setDetailsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/prop/getData/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setDetailsLoading(false);
      navigate(`/view-s-properties/${propertyId}`);
    } catch (err) {
      setDetailsLoading(false);
      setError(err.response?.data?.message || err.message || "An error occurred");
    }
  };

  return (
    <div className="relative container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recent Properties</h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1.2}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
          }}
        >
          {properties.map((property) => (
            <SwiperSlide key={property._id}>
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
                <div className="w-full h-96 bg-gray-200 relative overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-green-700 shadow-sm">
                    ₹{property.price.amount.toLocaleString()}
                  </div>
                </div>


                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 truncate mb-2">
                    {property.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {property.address.city}, {property.address.state}
                  </p>

                  <div className="flex items-center text-sm text-gray-600 space-x-4 mb-4">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {property.bedrooms} Beds
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {property.bathrooms} Baths
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {property.area} sqft
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(property._id)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {detailsLoading && (
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
    </div>
  );
};

export default GetRecentAdd;
