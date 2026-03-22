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

// ... existing transporter configuration

/**
 * Send welcome email after registration
 */
const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: `"AI Recruiter" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to AI Recruiter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for joining AI Recruiter. We're excited to have you on board.</p>
        <p>Now you can build your AI-powered profile, apply for jobs, and connect with recruiters.</p>
        <p>If you have any questions, feel free to reply to this email.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">AI Recruiter – Smart Hiring Platform</p>
      </div>
    `,
    text: `Welcome ${name}! Thank you for joining AI Recruiter. Build your profile and start your job search today.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`Failed to send welcome email to ${to}:`, error);
    return false;
  }
};

/**
 * Send login notification (optional)
 */
const sendLoginNotification = async (to, name) => {
  const mailOptions = {
    from: `"AI Recruiter" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'New login to your AI Recruiter account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${name},</p>
        <p>We noticed a new login to your AI Recruiter account at ${new Date().toLocaleString()}.</p>
        <p>If this was you, you can ignore this message. If you didn't log in, please reset your password immediately.</p>
        <p>Thank you,<br/>AI Recruiter Team</p>
      </div>
    `,
    text: `Hi ${name},\n\nWe noticed a new login to your AI Recruiter account at ${new Date().toLocaleString()}. If this was you, ignore this message. Otherwise, reset your password.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Login notification sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`Failed to send login notification to ${to}:`, error);
    return false;
  }
};

module.exports = { sendShortlistEmail, sendWelcomeEmail, sendLoginNotification };
