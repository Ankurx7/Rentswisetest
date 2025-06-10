const mongoose = require("mongoose");
const mailSender = require("../Utilities/mailSender");
const emailTemplate = require("../MailsT/emailverify");


const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,
    },
});

async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "RENTSWISE OTP Verification",
            emailTemplate(otp)
        );
    } catch (error) {
        throw error;
    }
}
OTPSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            await sendVerificationEmail(this.email, this.otp);
        } catch (error) {
            return next(error);
        }
    }
    next();
});


const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;
