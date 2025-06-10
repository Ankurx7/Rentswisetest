import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setLoading, setUserDetails } from "../../../Redux/Slices/userSlice.js";
import Spinner from "../Common/Spinner";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.auth.loading);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = { email, password };

        try {
            dispatch(setLoading(true));
            const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/auth/login`, loginData);

            dispatch(setLoading(false));
            dispatch(setUserDetails(response.data.userInfo));


            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
            }

            navigate("/");
        } catch (err) {
            dispatch(setLoading(false));
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred. Try again.");
            }
        }
    };


    const closeErrorDialog = () => {
        setError(null);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            {loading && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <Spinner />
                </div>
            )}

            {error && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 p-3 rounded-lg border border-gray-300 w-64 shadow-md">
                        <h3 className="text-base font-medium text-blue-800">Oops!</h3>
                        <p className="text-xs text-gray-800 mt-1">{error}</p>
                        <button
                            onClick={closeErrorDialog}
                            className="w-full mt-3 bg-blue-700 text-white py-1 rounded-md hover:bg-blue-800 transition text-xs"
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
                Your Gateway to the Best Rental Properties – Find Your Perfect Place Today!
            </h2>

            <form
                onSubmit={handleSubmit}
                className={`bg-white text-black p-6 rounded-md shadow-lg w-full max-w-sm flex flex-col space-y-4 transition-all duration-300 ease-in-out ${loading ? "blur-sm" : ""}`}
            >

                <div className="flex flex-col space-y-1">
                    <label htmlFor="email" className="text-xs font-semibold">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 text-xs bg-white"
                        required
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="password" className="text-xs font-semibold">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 text-xs bg-white"
                        required
                    />
                </div>


                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-2 rounded-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out text-xs"
                    disabled={loading}
                >
                    Login
                </button>

                <div className="text-center mt-4">
                    <Link to="/signup" className="text-gray-500 hover:underline text-xs">
                        Don't have an account? Signup here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
