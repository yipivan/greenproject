const axios = require('axios');
axios.get('https://api.data.gov.hk/v1/nearest-recyclable-collection-points',  {
    params: {
        lat: '22.32276541658044',
        long: '114.20116424560547', 
        max: 5000
    }
}).then(response => {
    let data = response.data.results;
    console.log(data.length);
})

//routing
// post /users/:id/search
// post /users/:id/usage
// get /users/:id/