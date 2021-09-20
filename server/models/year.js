const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const YearSchema = new Schema({
    year: Number,
    state_values: [{
        state: String,
        total_bee_colonies: Number
    }]
})

module.exports = mongoose.model('Year', YearSchema);