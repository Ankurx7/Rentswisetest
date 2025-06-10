import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Search from './Search/Search';
import Navbar from './Common/Navbar';
import GetRecentAdd from './Dashboard/recentlyadd';
import main from "../../public/main.webp";
import Footer from './Common/Footer';

const QuoteSlider = () => {
  const quotes = [
    "Simplifying the search for your ideal home.",
    "A refined approach to home search."
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="relative h-20 flex items-center justify-center ">
      <p
        className={`text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent transition-opacity duration-500 ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {quotes[currentQuoteIndex]}
      </p>
    </div>
  );
};
const Home = () => {
  
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        setIsTokenExpired(true);
        localStorage.removeItem("token");
      } else {
        setUserDetails(decodedToken);
      }
    } else {
      setIsTokenExpired(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && (isTokenExpired || !userDetails)) {
      navigate("/");
    }
  }, [isLoading, isTokenExpired, userDetails, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 h-2">
      <Navbar userDetails={userDetails} />
<div
  className="pt-28 pb-20 px-4 bg-cover bg-center relative"
  style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${main})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center 30%"
  }}
>
  <div className="max-w-7xl mx-auto">
    <div className="max-w-2xl mx-auto text-center mb-6 relative z-40">
      <div className="p-1 rounded-2xl shadow-lg bg-slate-200/5 backdrop-blur-sm border border-white/30">
        <QuoteSlider />
      </div>
    </div>


    <div className="max-w-3xl mx-auto mb-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 transform hover:shadow-2xl transition-shadow duration-300 relative overflow-visible">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-300 bg-clip-text text-transparent">
          {userDetails ? `Welcome back!` : 'Find Your Perfect Home'}
        </h2>
        <div className="relative z-[1000]"> 
          <Search />
        </div>
      </div>
    </div>


  </div>
</div>
    
      <div className="py-16 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="relative z-[10] bg-white shadow-md rounded-xl bg-gradient-to-r from-blue-700 to-pink-500 bg-clip-text text-transparent">
              Recently Added Properties
            </span>
          </h3>
          <GetRecentAdd />
        </div>
      </div>


<div className="bg-purple-900 text-white py-12">
  <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
    
  
    <div className="md:w-1/2">
      <h3 className="text-2xl font-semibold mb-4">Find Your Perfect Home Today</h3>
      <p className="text-base opacity-90 mb-6">Start searching now and discover amazing living spaces.</p>
      <button 
        className="bg-white text-purple-900 px-6 py-2 rounded-full font-medium hover:bg-purple-100 transition duration-300"
        onClick={() => window.scrollTo(0, 0)}
      >
        Get Started
      </button>
    </div>


    <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0">
      <Footer />
    </div>

  </div>
</div>


    </div>
  );
};

export default Home;
