const jwt = require("jsonwebtoken");
const User = require('../Models/user');
const dotenv = require("dotenv");
dotenv.config();

const jwtVerification = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please Login to continue" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token", error: error.message });
    }
};

const isLister = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'lister') {
            return res.status(403).json({ message: "Access denied, listers only" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while checking role", error: error.message });
    }
};

const isBuyer = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'buyer') {
            return res.status(403).json({ message: "Access denied, buyers only" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while checking role", error: error.message });
    }
};

module.exports = { jwtVerification, isLister, isBuyer };
