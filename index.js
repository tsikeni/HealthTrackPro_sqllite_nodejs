const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, Model, DataTypes } = require('sequelize');




const app = express();
const port = 3000;

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Define User model
class Patient extends Model {}

Patient.init({
    heart_rate: DataTypes.FLOAT,
    body_temp: DataTypes.FLOAT,
    pat_name: DataTypes.STRING,
    pat_nid: DataTypes.STRING,
    pat_freq_sickness: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Patient', 
    timestamps: true,
    underscored: true,
    tableName: 'patients'
  });

sequelize.sync();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); 


app.get('/pats', async (req, res) => {
  const users = await Patient.findAll();
  res.json(users);
});

app.get('/pat/:id', async (req, res) => {
  const user = await Patient.findByPk(req.params.id);
  res.json(user);
});

app.get('/patient-heart-rate/:id', async (req, res) => {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      const heartRate = patient.heart_rate;
      res.json({ heartRate });
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  });
  



app.post('/create/pat', async (req, res) => {
  const { body_temp, heart_rate, pat_nid } = req.body;

  if (
    (body_temp >= 35 && body_temp <= 38) &&
    (heart_rate >= 60 && heart_rate <= 90) &&
    pat_nid.length === 16
  ) {
    const user = await Patient.create(req.body);
    res.json(user);
  } else {
    let errorMessage = 'Invalid input.';

    if (body_temp < 35 || body_temp > 38) {
      errorMessage += ' Patient temperature should be between 35-38.';
    }

    if (heart_rate < 60 || heart_rate > 90) {
      errorMessage += ' Heart rate should be between 60-90.';
    }

    if (pat_nid.length !== 16) {
      errorMessage += ' NID should have exactly 16 characters.';
    }

    res.status(400).json({
      message: errorMessage,
    });
  }
});



app.put('/pat/:id', async (req, res) => {
  const user = await Patient.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

app.delete('/pat/:id', async (req, res) => {
  const user = await Patient.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
