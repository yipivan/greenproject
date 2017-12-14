const express = require('express');
const router = express.Router();
const Search_log = require('../models').search_log
const Usage_log = require('../models').usage_log


router.get('/', (req,res) => {
    res.render('recycle-points/search');
});

//When search, save log (mock up)

router.post('/search_route',(req,res)=>{
    Search_log.create({
        query: //query,
        location_lat: //lat,
        location_lng: //lng,
        user_id: //user
    })

    // find usage_log, if not exist, create one
    Usage_log.findOrCreate({
        where: {userID: user},defaults:{
            recycle_item_qty: 0,
            recycle_times: 0
        }
    })
    .spread((usage_log,created)=>{
        usage_log.recycle_item_qty += //req.item_qty
        usage_log.recycle_time += 1 //
    })
})

module.exports = router;