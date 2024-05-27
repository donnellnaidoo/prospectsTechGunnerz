// Nodemailer Config
module.exports = {
  emailTransport: {
    host: 'smtp.gmail.com', // Replace with your provider's host
    port: 587, // Replace with your provider's port (might be different)
    secure: false, // Set to true if using TLS
    auth: {
      user: 'prospects.za@gmail.com', // Replace with your email address
      pass: 'gzch bugl qzvv dbrk' // Replace with your email password
    }
  }
};
