const nodemailer = require('nodemailer');
const config = require('./config');

async function sendEmail(to, subject, htmlContent) {
  const transporter = nodemailer.createTransport(config.emailTransport);
  const mailOptions = {
    from: 'prospects.za@gmail.com', // Replace with your email address
    to,
    subject,
    html: htmlContent
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
