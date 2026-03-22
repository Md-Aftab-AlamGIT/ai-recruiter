const nodemailer = require("nodemailer");

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email to candidate when shortlisted
 * @param {string} to - recipient email
 * @param {string} candidateName - candidate's name
 * @param {string} jobTitle - job title (optional)
 */
const sendShortlistEmail = async (
  to,
  candidateName,
  jobTitle = "the position",
) => {
  const mailOptions = {
    from: `"AI Recruiter" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Congratulations! You have been shortlisted",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations, ${candidateName}!</h2>
        <p>We are pleased to inform you that you have been <strong>shortlisted</strong> for <strong>${jobTitle}</strong>.</p>
        <p>Our recruitment team will reach out to you shortly with the next steps.</p>
        <p>Thank you for applying through AI Recruiter!</p>
        <hr />
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply directly.</p>
      </div>
    `,
    text: `Congratulations ${candidateName}! You have been shortlisted for ${jobTitle}. Our recruitment team will reach out to you shortly.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Shortlist email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return false;
  }
};

module.exports = { sendShortlistEmail };
