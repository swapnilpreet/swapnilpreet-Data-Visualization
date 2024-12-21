const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const recordsRouter = require('../routes/Record.route')
const RecordModel = require('../models/Record.model');
const csv = require('csv-parser');
const fs = require('fs');
const UserRouter = require('../routes/User.route')

// Load environment variables
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));


// Load dataset into MongoDB
(async () => {
  await RecordModel.deleteMany();
  fs.createReadStream('./dataset.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await RecordModel.create({
        Day: row.Day,
        Age: row.Age,
        Gender: row.Gender,
        A: parseInt(row.A),
        B: parseInt(row.B),
        C: parseInt(row.C),
        D: parseInt(row.D),
        E: parseInt(row.E),
        F: parseInt(row.F),
      });
    })
    .on('end', () => {
      console.log('Dataset loaded into MongoDB.');
    });
})();

// Mount routes
app.use('/records', recordsRouter);
app.use('/user',UserRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
