const nominatim = require('nominatim-client');  
const Property = require('../Models/property');
const User = require('../Models/user');

const client = nominatim.createClient({
    useragent: "MyApp",
    referer: 'http://localhost:10000',
});

const geocodeAddress = async (address) => {
    try {
        if (!address.street || !address.city || !address.state || !address.country || !address.postalCode) {
            throw new Error('Incomplete address provided. Ensure street, city, state, country, and postalCode are present.');
        }

        const queries = [
            `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.postalCode}`, 
            `${address.city}, ${address.state}, ${address.country}`, 
            `${address.postalCode}, ${address.country}`, 
            `${address.postalCode}`
        ];

        for (const query of queries) {
            const result = await client.search({ q: query, addressdetails: '1' });
            if (result && result.length > 0) {
                return {
                    latitude: parseFloat(result[0].lat),
                    longitude: parseFloat(result[0].lon),
                };
            }
        }

        throw new Error('Geocoding failed: No matching location found for the provided address');
    } catch (err) {
        throw new Error('Geocoding error: ' + err.message);
    }
};
const createProperty = async (req, res) => {
    try {
        const { title, description, address, price, propertyType, bedrooms, bathrooms, area, amenities, images } = req.body;

        const requiredAddressFields = ['street', 'city', 'state', 'country', 'postalCode'];
        const missingFields = requiredAddressFields.filter(field => !address[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: `Incomplete address provided. Missing fields: ${missingFields.join(', ')}` 
            });
        }

        const { latitude, longitude } = await geocodeAddress(address);

        const property = new Property({
            title,
            description,
            address,
            price,
            propertyType,
            bedrooms,
            bathrooms,
            area,
            amenities,
            images,
            location: { type: 'Point', coordinates: [longitude, latitude] },
            listedBy: req.user.userId
        });

        await property.save();

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.propertiesListed.push(property._id);
        await user.save();

        res.status(201).json({ message: 'Property created successfully', property });
    } catch (err) {
        res.status(500).json({ message: 'Server error while creating property' });
    }
};
const editProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const {
            title, description, address, price, propertyType,
            bedrooms, bathrooms, area, amenities, images, isAvailable
        } = req.body;

        let latitude, longitude;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (property.listedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You do not have permission to edit this property" });
        }

        property.title = title || property.title;
        property.description = description || property.description;
        property.price = price || property.price;
        property.propertyType = propertyType || property.propertyType;
        property.bedrooms = bedrooms || property.bedrooms;
        property.bathrooms = bathrooms || property.bathrooms;
        property.area = area || property.area;
        property.amenities = amenities || property.amenities;
        property.images = images || property.images;
        property.isAvailable = isAvailable !== undefined ? isAvailable : property.isAvailable;

        if (address) {
            property.address = {
                ...property.address.toObject(),
                ...address
            };

            if (
                address.street &&
                address.city &&
                address.state &&
                address.country &&
                address.postalCode
            ) {
                const location = await geocodeAddress(property.address);
                latitude = location.latitude;
                longitude = location.longitude;
                property.location = { type: 'Point', coordinates: [longitude, latitude] };
            } else {
                return res.status(400).json({ message: "Incomplete address provided" });
            }
        }
        await property.save();
        res.status(200).json({ message: 'Property updated successfully', property });
    } catch (err) {
        res.status(500).json({ message: 'Server error while updating property' });
    }
};



const viewPropertiesByUser = async (req, res) => {
    try {
        const userId = req.user.userId;

        const properties = await Property.find({ listedBy: userId }).populate('listedBy', 'name email');

        if (properties.length === 0) {
            return res.status(404).json({ message: "No properties found for this user" });
        }

        res.status(200).json({ message: 'Properties fetched successfully', properties });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching properties' });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (property.listedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You do not have permission to delete this property" });
        }

        await Property.deleteOne({ _id: propertyId });

        const user = await User.findById(req.user.userId);
        user.propertiesListed = user.propertiesListed.filter(id => id.toString() !== propertyId);
        await user.save();

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while deleting property' });
    }
};

const getPropertyData = async (req, res) => {
    try {
        const { propertyId } = req.params;

        const property = await Property.findById(propertyId).populate('listedBy', 'name email');

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.status(200).json({ message: 'Property data fetched successfully', property });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching property data' });
    }
};

const getRecentProperties = async (req, res) => {
    try {
        const count = await Property.countDocuments();
        const properties = await Property.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();
    
        if (properties.length === 0) {
            return res.status(404).json({ message: "No properties found" });
        }

        res.status(200).json({ message: 'Recent properties fetched successfully', properties });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching recent properties' });
    }
};

module.exports = {
    createProperty,
    editProperty,
    viewPropertiesByUser,
    deleteProperty,
    getPropertyData,
    getRecentProperties 
};
