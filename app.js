const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const routesV1 = require('./src/routes/v1');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
routesV1(app);

const { PORT } = process.env || 4000;

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to mongoDB');
    app.listen(PORT, () => {
      console.log(`running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error', error.message);
  });
