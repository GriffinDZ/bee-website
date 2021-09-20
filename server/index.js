const config = require('./config/dev')
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = config.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = config.ATLAS_URI;
mongoose.connect(uri);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log("MongoDB connection successful.");
})

const yearsRouter = require('./routes/years')
app.use(yearsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})