const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('recycle-points/search');
});

module.exports = router;