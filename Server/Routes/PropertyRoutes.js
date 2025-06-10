const express = require("express")
const router = express.Router();

const { createProperty, editProperty, viewPropertiesByUser, getPropertyData, deleteProperty,getRecentProperties } = require('../Controllers/property');
const { jwtVerification, isLister, isBuyer } = require('../Middlewares/auth');


router.post('/create', jwtVerification, isLister, createProperty);
router.post('/edit/:propertyId', jwtVerification, isLister, editProperty);
router.post('/view-by-user', jwtVerification, isLister, viewPropertiesByUser);
router.post('/delete/:propertyId', jwtVerification, isLister, deleteProperty);
router.get('/getData/:propertyId', jwtVerification, getPropertyData);
router.get('/getRecentData', getRecentProperties);
module.exports = router;
 