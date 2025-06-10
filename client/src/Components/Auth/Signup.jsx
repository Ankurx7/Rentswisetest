import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setSignupData, setLoading } from "../../../Redux/Slices/userSlice.js";
import axios from "axios";
import Spinner from "../Common/Spinner";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "buyer",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.auth.loading);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (role) => {
        setFormData((prev) => ({ ...prev, role }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
        dispatch(setSignupData(formData));
        try {
            dispatch(setLoading(true));
            const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/auth/send-otp`, {
                email: formData.email,
            });
            dispatch(setLoading(false));

            const token = response.data.token;
            if (token) {
                localStorage.setItem("token", token);
            }
            navigate("/verify-mail");
        } catch (error) {
            dispatch(setLoading(false));
            setErrorMessage(error.response?.data?.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <Spinner />
                </div>
            )}

            {errorMessage && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 p-4 rounded-lg shadow-xl w-80">
                        <h3 className="text-xs font-semibold text-black">Oops!</h3>
                        <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
                        <button
                            onClick={() => setErrorMessage("")}
                            className="w-full mt-4 bg-indigo-600 text-white py-1 rounded-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300">
                Rentswise
            </h1>

            <form
                onSubmit={handleSubmit}
                className={`bg-white text-black p-6 rounded-md shadow-lg w-full max-w-sm ${loading ? "blur-sm" : ""} flex flex-col space-y-4 transition-all duration-300 ease-in-out`}
            >
                <div className="flex flex-col space-y-1">
                    <label htmlFor="name" className="text-xs font-semibold">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 text-xs bg-white"
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="email" className="text-xs font-semibold">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 text-xs bg-white"
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="password" className="text-xs font-semibold">
                        Password <span className="italic text-gray-500">(min. 6 characters)</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 text-xs bg-white"
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="confirmPassword" className="text-xs font-semibold">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 text-xs bg-white"
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold">Select your role</label>
                    <div className="flex justify-between space-x-4 mt-2">
                        <button
                            type="button"
                            onClick={() => handleRoleChange("buyer")}
                            className={`w-1/2 p-2 text-xs font-semibold rounded-sm transition-all duration-300 ease-in-out ${
                                formData.role === "buyer" ? "bg-red-200 text-red-700" : "bg-gray-100 text-gray-600"
                            } hover:bg-red-300 focus:outline-none`}
                        >
                            Buyer
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleChange("lister")}
                            className={`w-1/2 p-2 text-xs font-semibold rounded-sm transition-all duration-300 ease-in-out ${
                                formData.role === "lister" ? "bg-red-200 text-red-700" : "bg-gray-100 text-gray-600"
                            } hover:bg-red-300 focus:outline-none`}
                        >
                            Lister
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-2 rounded-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out text-xs"
                >
                    Signup
                </button>

                <p className="text-xs text-gray-600 text-center mt-2">
                    By signing up, you agree to our{" "}
                    <Link to="/terms" className="text-indigo-600 hover:underline">
                        Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-indigo-600 hover:underline">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </form>

            <div className="mt-4 text-xs text-center">
                <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
