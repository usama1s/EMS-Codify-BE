const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');

module.exports = {

    // BASE 64 TO PDF
    async base64ToPdf(file) {
        // const splitPdf = base64File.split(',')
        // const buffer = Buffer.from(splitPdf[1], 'base64');
        const base64File = file;
        const buffer = Buffer.from(base64File, 'base64');
        const defaultExtension = 'pdf';

        const fileName = `pdf_file${Date.now()}.${defaultExtension}`;
        const filePath = path.join(__dirname, '../uploads', fileName);

        await fs.writeFile(filePath, buffer);
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
    }
}