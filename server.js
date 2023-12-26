const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const db = require("./db.service.js/db.conn");
const index = require('./routes/index');
dotenv.config();


const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//CREATE DB IF NOT CREATED
db.createDatabase();

// ROUTE
app.use('/api', index);


const port = process.env.PORT || 5000;
const ipAddress = process.env.IP_ADDRESS || 'localhost';

app.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});