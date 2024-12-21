const express = require('express');
const Record = require('../models/Record.model');
const router = express.Router();


// Get all records
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    console.log("startDate, endDate", startDate, endDate);

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const data = await Record.find({
     Day: {
        $gte: startDate,
        $lte: endDate,
      },
    });

   res.send({
    success: true,
    message: "Successfully created",
    data: data
   })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Filter records
router.get('/filter', async (req, res) => {
  const { day, age, gender } = req.query;
  const conditions = {};

  if (day) conditions.day = day;
  if (age) conditions.age = age;
  if (gender) conditions.gender = gender;

  try {
    const records = await Record.find(conditions);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new record
// router.post('/', async (req, res) => {
//   try {
//     const newRecord = await Record.create(req.body);
//     res.status(201).json(newRecord);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Aggregated data
router.get('/aggregate', async (req, res) => {
  try {
    const records = await Record.find();
    const aggregate = records.reduce(
      (acc, record) => {
        acc.A += record.A;
        acc.B += record.B;
        acc.C += record.C;
        acc.D += record.D;
        acc.E += record.E;
        acc.F += record.F;
        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
    );
    res.json(aggregate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
