import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

const Navbar = ({ userDetails }) => {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!userDetails);


  useEffect(() => {
    const handleResize = () => setIsMenuOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleListProperty = () => {
    if (isLoggedIn) {
      navigate('/createProperty');
      setIsMenuOpen(false);
    } else {
      setShowError(true);
    }
  };

  return (
    <>

      <nav className="fixed top-0 w-full bg-white/95 border-b border-gray-200 backdrop-blur-lg shadow-md z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Rentswise
              </span>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleListProperty}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                List Property
              </button>

              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate('/listerDashboard')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    My Listings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg hover:opacity-90"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="ml-2 px-5 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-700"
            >
              <FiMenu size={26} />
            </button>
          </div>
        </div>
      </nav>

 
      {isMenuOpen && (
        <div 
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black opacity-30 z-40"
        />
      )}


      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out rounded-l-xl border-l border-gray-200 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col py-12 px-6 items-center space-y-4">
          <button
            onClick={handleListProperty}
            className="w-full py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            List Property
          </button>

          {/* Classic Gradient Divider */}
          <div className="w-full h-px bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 my-4" />

          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  navigate('/listerDashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                My Listings
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="w-full py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setIsMenuOpen(false);
                }}
                className="w-full py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {showError && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowError(false)}
        >
          <div
            className="bg-white p-6 rounded-xl max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Authentication Required
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please login or create an account to list your property.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowError(false);
                  navigate('/login');
                }}
                className="w-full px-4 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowError(false);
                  navigate('/signup');
                }}
                className="w-full px-4 py-2 text-sm border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
