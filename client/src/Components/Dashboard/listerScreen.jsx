import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Common/Spinner';

const ListerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/prop/view-by-user`,
        { page },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if (page === 1) {
        setProperties(response.data.properties);
      } else {
        setProperties(prev => [...prev, ...response.data.properties]);
      }
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !isLoading &&
        page < totalPages
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, page, totalPages]);

  const handleEditProperty = (propertyId) => navigate(`/editProperty/${propertyId}`);
  const handleDeleteConfirmation = (propertyId) => {
    setPropertyToDelete(propertyId);
    setShowDeleteDialog(true);
  };
  const handleDeleteProperty = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/prop/delete/${propertyToDelete}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setProperties(prev => prev.filter(prop => prop._id !== propertyToDelete));
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-blue-600">Rentswise</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Properties</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {property.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {property.bedrooms} Beds
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {property.bathrooms} Baths
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  ₹{property.price.amount} {property.price.type}
                </p>
                <p className="text-sm text-gray-600">
                  {property.area} sq.ft · {property.address.city}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEditProperty(property._id)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteConfirmation(property._id)}
                    className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <Spinner />
            </div>
        )}

        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
              <div className="flex items-center mb-4 space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">
                  Confirm Delete
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this property? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProperty}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListerDashboard;
