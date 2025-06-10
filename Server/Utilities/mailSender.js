const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: true,
    },
});

const mailSender = async (email, title, body) => {
    try {
        const mailOptions = {
            from: `"RentsWise" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new Error('Unable to send email at the moment. Please try again later.');
    }
};

module.exports = mailSender;
