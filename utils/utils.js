const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const taxSlabs = [
    { minSalary: 0, maxSalary: 50000, taxRate: 0 },
    { minSalary: 50001, maxSalary: 75000, taxRate: 0.05 },
    { minSalary: 75001, maxSalary: 100000, taxRate: 0.1 },
    { minSalary: 100001, maxSalary: 150000, taxRate: 0.15 },
    { minSalary: 150001, maxSalary: 250000, taxRate: 0.175 },
    { minSalary: 250001, maxSalary: 350000, taxRate: 0.2 },
    { minSalary: 350001, maxSalary: Infinity, taxRate: 0.225 }
];




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
        } else if (status === 'salary') {
            text = 'Your salary has been credited.'
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

    calculateMonthlyTax: async (monthlySalary) => {
        // Calculate annual salary
        // const annualSalary = monthlySalary * 12;

        // Calculate tax for annual salary
        let tax = 0;
        let monthlyTax;

        for (const slab of taxSlabs) {
            if (monthlySalary > slab.maxSalary) {
                tax += (slab.maxSalary - slab.minSalary + 1) * slab.taxRate;
            } else if (monthlySalary >= slab.minSalary && monthlySalary <= slab.maxSalary) {
                tax += (monthlySalary - slab.minSalary + 1) * slab.taxRate;
                break;
            }
        }
        // monthlyTax = tax / 12;
        // Return monthly tax amount
        return tax
    },

    getCurrentMonthYear: async () => {
        const currentDate = new Date();

        // Array of month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"
        ];

        // Extracting the current day, month, and year
        const currentDay = currentDate.getDate();
        const Day = 28
        const currentMonthNumber = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        let monthNumber = currentMonthNumber;
        let year = currentYear;

        // Increment month if current day is 28
        // if (Day === 28) {
        if (currentDay === 28) {
            monthNumber = (currentMonthNumber + 1) % 12; // Increment month (roll over if December)
            if (monthNumber === 0) {
                year++; // Increment year if it rolls over to January of the following year
            }
        }

        const monthName = monthNames[monthNumber];

        return { monthName, year }; // Returning as an object
    }


}
