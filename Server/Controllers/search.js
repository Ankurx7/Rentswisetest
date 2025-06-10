const axios = require("axios");
const Property = require("../Models/property");

const getLatLngFromAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    address
  )}&format=json&addressdetails=1&limit=1&countrycodes=IN`;

  try {
    const response = await axios.get(url);
    if (response.data.length === 0) {
      throw new Error("No location found for the given address.");
    }

    const { lat, lon } = response.data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } catch (error) {
    throw new Error("Failed to fetch location coordinates.");
  }
};


const parseBudget = (budgetType, budget) => {
  let minBudget = 0;
  let maxBudget = Infinity;

  if (budgetType === "Rent") {
    if (budget === "< 10k per month") {
      maxBudget = 10000;
    } else if (budget === "10-20k per month") {
      minBudget = 10000;
      maxBudget = 20000;
    } else if (budget === "20-40k per month") {
      minBudget = 20000;
      maxBudget = 40000;
    } else if (budget === "> 40k per month") {
      minBudget = 40001;
    }
  } else if (budgetType === "Sale") {
    if (budget === "< 50 lakhs") {
      maxBudget = 5000000;
    } else if (budget === "< 1 crore") {
      maxBudget = 10000000;
    } else if (budget === "< 2 crore") {
      maxBudget = 20000000;
    } else if (budget === "< 5 crore") {
      maxBudget = 50000000;
    } else if (budget === "5 crore+") {
      minBudget = 50000001; 
    }
  }

  return { minBudget, maxBudget };
};

const searchProperties = async (req, res) => {
  try {
    const { location, bedroom, propertyType, budgetType, budget } = req.query;

    if(!location || location.trim() === ""){
      return res.status(400).json({ success: false, message: "Location is required" });
    }

    const {latitude, longitude} = await getLatLngFromAddress(location);

  
    const filters = {};

    if(bedroom){
      const bedroomsArray = bedroom.split(",");
      filters.bedrooms = { $in: bedroomsArray.map((b) => parseInt(b)) };
    }

    if(propertyType){
      filters.propertyType = { $in: propertyType.split(",") };
    }

    if(budgetType && budget){
      const { minBudget, maxBudget } = parseBudget(budgetType, budget);
      filters["price.amount"] = { $gte: minBudget, $lte: maxBudget };
      filters["price.type"] = budgetType;
    }

    const properties = await Property.find({
      ...filters,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000000, 
        },
      },
    })
      .limit(500) 
      .exec();

    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No properties found matching your criteria.",
      });
    }

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error in searchProperties:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while searching for properties.",
    });
  }
};

module.exports = {
  searchProperties,
};
