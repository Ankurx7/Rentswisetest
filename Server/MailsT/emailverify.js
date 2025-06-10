const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secure Verification - RENTSWISE</title>
  <style>
    body {
      background-color: #ffffff;
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      text-align: center;
    }
    .logo {
      max-width: 120px;
      margin-bottom: 20px;
    }
    .header {
      font-size: 22px;
      font-weight: bold;
      color: #000000;
      margin-bottom: 15px;
    }
    .code-container {
      background-color: #f8f8f8;
      padding: 15px;
      border: 1px solid #dddddd;
      border-radius: 8px;
      display: inline-block;
      margin-bottom: 20px;
    }
    .code {
      font-size: 36px;
      font-weight: bold;
      color: #d4af37;
      letter-spacing: 3px;
    }
    .details {
      font-size: 16px;
      color: #666666;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      padding: 12px 20px;
      background-color: #d4af37;
      color: #ffffff;
      font-size: 14px;
      font-weight: bold;
      text-decoration: none;
      border-radius: 5px;
    }
    .cta-button:hover {
      background-color: #b79526;
    }
    .footer {
      font-size: 12px;
      color: #888888;
      margin-top: 20px;
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
      margin: 0 5px;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    @media (max-width: 600px) {
      .container {
        padding: 15px;
      }
      .header {
        font-size: 20px;
      }
      .code {
        font-size: 30px;
      }
    }
  </style>
</head>
<body>
  <div>
  <div class="container">
    <img src="https://via.placeholder.com/120" alt="RENTSWISE Logo" class="logo">
    <div class="header">OTP Verification Code</div>
    <div class="details">
      <p>Welcome to Rentswise!</p>
      <p>To complete your registration, use the code below:</p>
    </div>
    <div class="code-container">
      <div class="code">${otp}</div>
    </div>
    <div class="details">
      <p>The code is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
      <p>If you didn't request this, ignore this email or contact our support team.</p>
    </div>
    <a href="mailto:support@rentswise.com" class="cta-button">Contact Support</a>
    <div class="footer">
      <p>&copy; 2025 RENTSWISE. All rights reserved.</p>
      <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
    </div>
  </div>
  
</body>
</html>`;
};

module.exports = otpTemplate;
