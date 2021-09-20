const router = require('express').Router();
const Year = require('../models/year');

router.get('/:year', async (req, res) => {
    await Year.find({ year: req.params.year })
        .then(year => res.json(year))
        .catch(err => res.status(400).json('Error ' + err));
});

module.exports = router;