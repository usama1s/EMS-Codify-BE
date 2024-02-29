const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const db = require('./db.service.js/db.conn');
const index = require('./routes/index');
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());

// CORS Middleware
const allowedOrigins = ['http://localhost:5173'];
app.use(cors());
app.use(cors({
  origin: allowedOrigins,
}));

// Additional Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create DB if not created
db.createDatabase();

// Routes
app.use('/api', index);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Server Configuration
const port = process.env.PORT || 5000;
const ipAddress = process.env.IP_ADDRESS || 'localhost';

app.listen(port, ipAddress, () => {
  console.log(`Server is running on http://${ipAddress}:${port}`);
});
