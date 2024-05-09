const nodemailer = require("nodemailer");

const AWS_MAIL_DRIVER = process.env.AWS_MAIL_DRIVER;
const AWS_MAIL_HOST = process.env.AWS_MAIL_HOST;
const AWS_MAIL_PORT = process.env.AWS_MAIL_PORT;
const AWS_MAIL_USERNAME = process.env.AWS_MAIL_USERNAME;
const AWS_MAIL_PASSWORD = process.env.AWS_MAIL_PASSWORD;
const AWS_MAIL_ENCRYPTION = process.env.AWS_MAIL_ENCRYPTION;
const AWS_MAIL_FROM_ADDRESS = process.env.AWS_MAIL_FROM_ADDRESS;
const GMAIL_USERNAME = process.env.GMAIL_USERNAME
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD
const GMAIL_FROM = process.env.GMAIL_FROM
  
async function sendEmail(data) {
    let { to, subject, text, type, html } = data;
    if (type == "gmail") {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: GMAIL_USERNAME,
                pass: GMAIL_PASSWORD
            }
        })
        const mailOptions = {
            from: GMAIL_FROM,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log("Gmail sent successfully!");
            return true;
        } catch (error) {
            console.error("Error sending gmail:", error);
            return "";
        }
    }
    else if (type == "mailtrap") {
        try {
            const transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "4d22bfc6ab5b8b",
                    pass: "fec10687941ee4"
                }
            });
            await transporter.sendMail(mailOptions);
            console.log("Gmail sent successfully!");
            return true;
        } catch (error) {
            console.error("Error sending gmail:", error);
            return "";
        }
    }
    else {
        const transporter = nodemailer.createTransport({
            host: AWS_MAIL_HOST,
            port: AWS_MAIL_PORT,
            auth: {
                user: AWS_MAIL_USERNAME,
                pass: AWS_MAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: AWS_MAIL_FROM_ADDRESS,
            to: to,
            subject: subject,
            text: text,
        };
        try {
            await transporter.sendMail(mailOptions);
            console.log("SES email sent successfully!");
            return true;
        } catch (error) {
            console.error("SES error sending email:", error);
            return "";
        }
    }

}

module.exports = sendEmail;