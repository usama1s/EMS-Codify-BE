const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {

    // BASE 64 TO PDF
    async base64ToPdf(file) {
        const splitPdf = file.split(",");
        const base64File = splitPdf[1];
        const buffer = Buffer.from(base64File, 'base64');
        const defaultExtension = 'pdf';

        const fileName = `pdf_file${Date.now()}.${defaultExtension}`;
        const filePath = path.join(__dirname, '../uploads', fileName);

        await fsPromise.writeFile(filePath, buffer);
        return filePath;
    },

    // BASE 64 TO JPEG
    async base64ToJpg(file) {
        try {
            const splitJpg = file.split(",");
            const base64File = splitJpg[1]; // Take the second element after splitting
            const buffer = Buffer.from(base64File, "base64");
            const defaultExtension = "jpeg";

            const fileName = `jpg_file${Date.now()}.${defaultExtension}`;
            const filePath = path.join(__dirname, "../uploads", fileName);

            await fsPromise.writeFile(filePath, buffer);
            return filePath;
        } catch (error) {
            console.error("Error converting base64 to jpg:", error);
            throw error; // Re-throw the error for proper error handling in the calling code
        }
    },

    convertFileIntoBase64: (filename) => {
        try {
            const filePath = path.join(__dirname, "../uploads", filename);

            function base64_encode(file) {
                const bitmap = fs.readFileSync(file);
                return Buffer.from(bitmap).toString("base64");
            }

            const base64File = base64_encode(filePath);
            return base64File;
        } catch (error) {
            console.error(error);
        }
    },

    extractFilenameFromURL: (url) => {
        const parts = url.split('\\');
        return parts[parts.length - 1];
    },

    // GET TIME IN ET TIME ZONE
    getCurrentDateTimeInET: () => {
        const currentDate = new Date();
        // Convert to UTC
        const utcDate = new Date(currentDate.toUTCString());
        const etOffset = -4 * 60; // UTC-4 for Eastern Time (ET)
        const etDate = new Date(utcDate.getTime() + etOffset * 60000);
        const hours = etDate.getUTCHours();

        return etDate;
    },

    getCurrentDateTimeWithTimeZone: () => {
        const currentDate = new Date();
        // Extract time zone offset in minutes
        const fullDate = currentDate.toLocaleString('en-US', { timeZoneName: 'short' });
        function getTimeZone(date) {
            const dateString = date;

            // Regular expression to match the time zone abbreviation
            const timeZoneRegex = /\b([A-Z]{3,4})\b/;

            // Extract time zone
            const timeZoneMatch = dateString.match(timeZoneRegex);
            const timeZone = timeZoneMatch ? timeZoneMatch[1] : null;
            return timeZone
        }
        const timeZone = getTimeZone(fullDate)

        return { currentDate, timeZone }

    },


    // CONVERT TIME TO EST
    convertToEST: (date_time, timezone) => {
        const etOffset = -4 * 60; // Offset for Eastern Time (ET) in minutes

        // Check if the timezone is already Eastern Time (ET)
        if (timezone === 'EST' || timezone === 'EDT') {
            return date_time;
        }

        // Convert to UTC time
        const utcTime = new Date(date_time.getTime() + date_time.getTimezoneOffset() * 60000);

        // Convert to Eastern Time (ET)
        const estTime = new Date(utcTime.getTime() + etOffset * 60000);

        return estTime;
    },


    sendEmail: async (email, status) => {
        let text;
        if (status === 3) {
            text = 'Your leave request has been rejected.'
        } else if (status === 2) {
            text = 'Your leave request has been Approved.'
        }
        else if (status === 'contract') {
            text = 'Your contract is active.'
        }
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS
            },
            tls: { rejectUnauthorized: false },
        });
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Reply To Leave Application',
            text: text
        };

        // Send the email
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    },


}