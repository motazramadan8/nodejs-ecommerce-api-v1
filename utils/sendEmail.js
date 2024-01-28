const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create transporter object (Service that will send email like "gmail")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false: 587, if true: 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email options (like from, to, subject, email content)
  const mailOptions = {
    from: "E-shop App <devister.org@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
