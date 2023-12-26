const fs = require('fs').promises;
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
        // const splitJpg = base64File.split(',')
        // const buffer = Buffer.from(splitJpg[1], 'base64');
        if (!file) {
            throw new Error("Base64 string is undefined");
        }
        const base64File = file;
        const buffer = Buffer.from(base64File, 'base64');
        const defaultExtension = 'jpeg';

        const fileName = `jpg_file${Date.now()}.${defaultExtension}`;
        const filePath = path.join(__dirname, '../uploads', fileName);

        await fs.writeFile(filePath, buffer);
        return filePath;
    },

    // BASE 64 TO MP4
    async base64ToMp4(file) {
        // const splitJpg = base64File.split(',')
        // const buffer = Buffer.from(splitJpg[1], 'base64');

        const base64File = file;
        const buffer = Buffer.from(base64File, 'base64');
        const defaultExtension = 'mp4';

        const fileName = `mp4_file${Date.now()}.${defaultExtension}`;
        const filePath = path.join(__dirname, '../uploads', fileName);

        await fs.writeFile(filePath, buffer);
        return filePath;
    },
}