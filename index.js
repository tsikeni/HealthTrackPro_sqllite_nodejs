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
    pat_freq_sickness: DataTypes.INTEGER
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
app.use(express.static('public')); //serve static files like .html


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
  const user = await Patient.create(req.body);
  res.json(user);
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
