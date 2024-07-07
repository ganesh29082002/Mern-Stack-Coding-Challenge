const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const mainRoutes = require('./routes/mainRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());  

const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(mainRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
