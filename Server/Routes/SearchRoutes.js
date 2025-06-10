const express = require("express")
const router = express.Router();

const { searchProperties} = require('../Controllers/search')
const { jwtVerification } = require('../Middlewares/auth');

router.post('/search', jwtVerification, searchProperties );

module.exports = router;