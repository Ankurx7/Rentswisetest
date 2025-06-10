import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setSignupData, setLoading, setUserDetails } from "../../../Redux/Slices/userSlice.js";
import axios from "axios";
import Spinner from "../Common/spinner";

const VerifyMail = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timeLeft, setTimeLeft] = useState(300);
    const [errorMessage, setErrorMessage] = useState("");
    const { signupData } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.auth.loading);


    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const handleChange = (value, index) => {
        if (/^[0-9]*$/.test(value)) {
            const updatedOtp = [...otp];
            updatedOtp[index] = value;
            setOtp(updatedOtp);

            if (value && index < otp.length - 1) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const completeData = { ...signupData, otp: otp.join("") };
        try {
            dispatch(setLoading(true));
            const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/auth/signup`, completeData);

            dispatch(setLoading(false));
            dispatch(setUserDetails(response.data.userInfo));

            navigate("/");
        } catch (error) {
            dispatch(setLoading(false));
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || "An error occurred");
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        }
    };

    const closeErrorDialog = () => {
        setErrorMessage("");
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    };

    return (
        <div className="relative min-h-screen bg-white flex flex-col items-center justify-center p-4">
            {loading && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <Spinner />
                </div>
            )}


            {errorMessage && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-red-100 via-white to-red-200 p-4 rounded-lg border border-black w-80 shadow-lg">
                        <h3 className="text-lg font-semibold text-red-700">Oops!</h3>
                        <p className="text-sm text-black mt-2">{errorMessage}</p>
                        <button
                            onClick={closeErrorDialog}
                            className="w-full mt-4 bg-blue-800 text-white py-1.5 rounded-md hover:bg-blue-900 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}


            <h1 className="text-3xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300">
                Rentswise
            </h1>


            <div className="w-16 h-1 bg-indigo-600 mb-4"></div>


            <h2 className="text-xl font-medium text-center text-indigo-600 mb-8">
                One Step Closer to Your Perfect Home!
            </h2>


            <form
                onSubmit={handleSubmit}
                className={`bg-white text-black p-6 rounded-md shadow-lg w-full max-w-sm flex flex-col space-y-4 transition-all duration-300 ease-in-out ${loading ? "blur-sm" : ""}`}
            >
                <div className="flex justify-between space-x-1 sm:space-x-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            className="w-8 h-8 sm:w-10 sm:h-10 text-center border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 text-lg bg-white"
                            disabled={timeLeft <= 0 || loading}
                        />
                    ))}
                </div>


                <div className="flex items-center justify-center mt-4">
                    <div className="px-4 py-2 bg-gradient-to-r from-green-100 via-white to-blue-100 rounded-md border border-blue-400 shadow-sm text-xs sm:text-sm font-medium text-gray-700">
                        {timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : "OTP Expired"}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out text-sm"
                    disabled={timeLeft <= 0 || loading}
                >
                    Verify
                </button>

                <div className="text-center mt-4">
                    <Link to="/signup" className="text-gray-500 hover:underline text-xs">
                        Go back to Signup
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default VerifyMail;
