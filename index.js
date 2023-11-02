const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const port = 3000; 

const db = new sqlite3.Database('patients_data.db'); 

app.use(express.json());

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY,
    rate REAL,
    status INTEGER,
    temperature REAL
  )
`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Table "patients" created or already exists.');
  }
});



app.post('/api/heartRate', (req, res) => {
  const { id, heart_rate, status, temperature} = req.body;
  const insertQuery = `INSERT INTO patients (id, rate, status,temperature) VALUES (?, ? , ? ,?)`;
  db.run(insertQuery, [id, heart_rate, status], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error inserting data.');
    } else {
      res.status(200).send('Data received and stored.');
    }
  });
});


app.get('/api/heartRate', (req, res) => {
  const selectQuery = 'SELECT * FROM patients';
  db.all(selectQuery, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving data.');
    } else {
      res.json(rows);
    }
  });
});


app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
