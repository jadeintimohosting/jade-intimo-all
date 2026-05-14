import nodemailer from "nodemailer"
import logger from "#config/logger.js"

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});


export async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: `"Jade-Intimo" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    text,
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to} (subject="${subject}", messageId=${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email to ${to} (subject="${subject}"): ${error.message}`, error);
    return { success: false, error };
  }
}
