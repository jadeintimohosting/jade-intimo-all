import nodemailer from "nodemailer"

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
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}