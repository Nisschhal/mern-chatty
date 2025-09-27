import { createWelcomeEmailTemplate } from "../email/email-template.js"
import nodemailer from "nodemailer"
export const sendEmail = async (email, name, clientUrl) => {
  try {
    const { SENDER_EMAIL, SENDER_PASSWORD } = process.env
    // Step 1: Create the transporter with enhanced security
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true, // Ensures secure connection
      },
    })

    // Step 2: Prepare email content based on type
    const mailOptions = {
      from: `CHATTY <${SENDER_EMAIL}>`,
      to: email,
      subject: "Mern Chatty Welcome",
      html: createWelcomeEmailTemplate(name, clientUrl),
      headers: {
        "List-Unsubscribe": "<mailto:unsubscribe@mernchatty.com>",
        "Reply-To": SENDER_EMAIL ? SENDER_EMAIL : "info@mernchatty.com",
        "X-Mailer": "Chatty Email Service",
      },
    }

    // Step 3: Send the email
    const info = await transporter.sendMail(mailOptions)

    console.log("Email sent successfully!")
    console.log("Message ID:", info.messageId)
    console.log("Response:", info.response)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
    return undefined
  }
}
