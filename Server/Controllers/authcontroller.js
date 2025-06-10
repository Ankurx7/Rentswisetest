const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require("otp-generator");

const dotenv = require('dotenv');
dotenv.config();

const generateJWT = (userId, role) => {
  const payload = { userId, role };
  const expiresIn = Date.now() + 5 * 60 * 60 * 1000;
  payload.exp = Math.floor(expiresIn / 1000);
  return jwt.sign(payload, process.env.JWT_SECRET);
};
exports.signup = async (req, res) => {
  const { name, email, password, confirmPassword, role, otp } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not sent or expired' });
    }

    if (otp !== otpRecord.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = new User({ name, email, password, role, propertiesListed: [] });
    await user.save();

    const token = generateJWT(user._id, user.role);


    res.cookie('token', token, {
      httpOnly: true,      
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 5 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      message: 'User created and logged in successfully',
      token: token,
      userInfo: {
        name: user.name,
        email: user.email,
        role: user.role,
        propertiesListed: user.propertiesListed,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up user', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = generateJWT(user._id, user.role);

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,    
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 5 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: 'Login successful',
      token: token,
      userInfo: {
        name: user.name,
        email: user.email,
        role: user.role,
        propertiesListed: user.propertiesListed,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};



exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const checkUserPresent = await User.findOne({ email });
  if (checkUserPresent) {
    return res.status(401).json({
      success: false,
      message: `User is Already Registered`,
    })
  }
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    let otpDocument = await OTP.findOne({ otp });
    while (otpDocument) {
      otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false, digits: true });
      otpDocument = await OTP.findOne({ otp });
    }

    const otpPayload = { email, otp };
    const otpRecord = await OTP.create(otpPayload);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to the provided email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while sending OTP.",
      error: error.message,
    });
  }
};


