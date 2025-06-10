import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setLoading } from "../../../Redux/Slices/userSlice.js";
import Spinner from "../Common/Spinner";
import axios from "axios";
import rentswiseBackground from "../../../public/rentswise1.webp"; 

const EditProperty = () => {
  const { propertyId } = useParams(); 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    },
    price: {
      amount: "",
      type: "Rent",
    },
    propertyType: "Apartment",
    bedrooms: "",
    bathrooms: "",
    area: "",
    amenities: [],
    images: [],
    isAvailable: true,
  });
  const navigate = useNavigate();
  const [amenity, setAmenity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/v1/prop/getData/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setFormData(response.data.property);
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (e, key) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: value,
      },
    }));
  };

  const addAmenity = () => {
    if (amenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
      setAmenity("");
    }
  };

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      setImageUrl("");
    }
  };

  const removeAmenity = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, index) => index !== indexToRemove),
    }));
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/prop/edit/${propertyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Property updated successfully:", response.data);
      navigate(`/listerDashboard`);
    } catch (error) {
      console.error("Error updating property:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url(${rentswiseBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Spinner />
        </div>
      )}
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="bg-white rounded-lg shadow-sm p-6 bg-opacity-90">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Edit Property</h1>
            <p className="mt-1 text-sm text-gray-500">Update your property details</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
          
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                  placeholder="Modern 2BHK apartment..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                  rows="3"
                  placeholder="Describe your property..."
                  required
                />
              </div>
            </div>

 
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="PG/Hostel">PG/Hostel</option>
                <option value="Apartment">Apartment</option>
                <option value="Residential">Residential</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>


<div className="space-y-3">
  <h3 className="block text-xs font-medium text-gray-800">Address</h3>
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <div>
      <label className="block text-xs font-medium text-gray-800 mb-1">Street</label>
      <input
        type="text"
        name="street"
        value={formData.address.street}
        onChange={(e) => handleNestedInputChange(e, "address")}
        className="w-full px-3 py-2 text-xs bg-white text-gray-800 placeholder-gray-500 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
        placeholder="Enter street"
        required
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-800 mb-1">City</label>
      <input
        type="text"
        name="city"
        value={formData.address.city}
        onChange={(e) => handleNestedInputChange(e, "address")}
        className="w-full px-3 py-2 text-xs bg-white text-gray-800 placeholder-gray-500 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
        placeholder="Enter city"
        required
      />
    </div>
  </div>
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="block text-xs font-medium text-gray-800 mb-1">State</label>
      <input
        type="text"
        name="state"
        value={formData.address.state}
        onChange={(e) => handleNestedInputChange(e, "address")}
        className="w-full px-3 py-2 text-xs bg-white text-gray-800 placeholder-gray-500 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
        placeholder="Enter state"
        required
      />
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-800 mb-1">Postal Code</label>
      <input
        type="text"
        name="postalCode"
        value={formData.address.postalCode}
        onChange={(e) => handleNestedInputChange(e, "address")}
        className="w-full px-3 py-2 text-xs bg-white text-gray-800 placeholder-gray-500 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
        placeholder="Enter postal code"
        required
      />
    </div>
  </div>
  <div>
    <label className="block text-xs font-medium text-gray-800 mb-1">Country</label>
    <input
      type="text"
      name="country"
      value={formData.address.country}
      onChange={(e) => handleNestedInputChange(e, "address")}
      className="w-full px-3 py-2 text-xs bg-white text-gray-800 placeholder-gray-500 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
      placeholder="Enter country"
      required
    />
  </div>
</div>


         
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-xs text-gray-500">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.price.amount}
                    onChange={(e) => handleNestedInputChange(e, "price")}
                    className="w-full pl-6 pr-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Listing Type</label>
                <select
                  name="type"
                  value={formData.price.type}
                  onChange={(e) => handleNestedInputChange(e, "price")}
                  className="w-full px-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Rent">For Rent</option>
                  <option value="Sale">For Sale</option>
                </select>
              </div>
            </div>

           
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                  placeholder="Bedrooms"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                  placeholder="Bathrooms"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Area (sq ft)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                  placeholder="Area"
                  required
                />
              </div>
            </div>

        
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Amenities</label>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  value={amenity}
                  onChange={(e) => setAmenity(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                  placeholder="Add amenity..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addAmenity())
                  }
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors sm:w-auto w-full"
                >
                  Add Amenity
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.amenities.map((a, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full inline-flex items-center gap-1"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

           
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Image URLs</label>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white text-gray-800 rounded border border-gray-300 focus:ring-1 focus:ring-blue-500"
                  placeholder="Paste image URL..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addImageUrl())
                  }
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors sm:w-auto w-full"
                >
                  Add Image
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-20 object-cover rounded border border-gray-200 hover:border-blue-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-600 hover:text-red-800 shadow-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
            >
              Update Property
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
