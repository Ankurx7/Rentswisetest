const mongoose = require("mongoose");
const { Schema } = mongoose;

const propertySchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Property title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Property description is required"],
        },
        address: {
            street: { type: String, required: true },   
            district: { type: String },      
            city: { type: String, required: true },     
            state: { type: String, required: true },     
            country: { type: String, required: true, default: "India" },
            postalCode: { type: String, required: true }, 
            landmark: { type: String },
        },
        location: {                                              
            type: { type: String, default: 'Point' }, 
            coordinates: { type: [Number], required: true }  
        },
        price: {
            amount: { type: Number, required: [true, "Price is required"] },
            type: {
                type: String,
                enum: ["Rent", "Sale"],
                required: [true, "Price type is required"]
            },
        },
        propertyType: {
            type: String,
            enum: ['PG/Hostel', 'Apartment', 'Residential', 'Villa', 'Commercial'],
            required: [true, "Property type is required"],
        },
        bedrooms: {
            type: Number,
            required: true,
        },
        bathrooms: {
            type: Number,
            required: true,
        },
        area: {
            type: Number,
            required: true,
        },
        amenities: {
            type: [String],
        },
        images: {
            type: [String],
        },
        listedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

propertySchema.index({ location: '2dsphere' });

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
module.exports = Property;
