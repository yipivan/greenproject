// create search_log & usage_log with user_id, only if user is loggedin
if (req.session.passport.user) {
  User.findOne({
    where: { emailOrId: req.session.passport.user.id }  }).then(user => {
    Search_log.create({
      userId: req.session.passport.user.id,
      query: "search_input",
      location_lat: "location_lat",
      location_lng: "location_lng"
    });
  });
}

//retrieve search_log data (latest 10) at user profile

Search_log.findAll({
  where: {
    userId: req.session.passport.user.id
  },
  limit: 10,
  order: [ [ 'createdAt', 'DESC' ]]
}).then(search_log => {
  return search_log;
});

//update recycle_times data whenever confirm recycle

Usage_log.findOne({
    where: {
      userId: req.session.passport.user.id
    }
}).then(usage_log=>{
    usage_log.increment('recycle_times',{by: 1})
})

//return usage_log data

Usage_log.findOne({
    where: {
      userId: req.session.passport.user.id
    }
}).then(usage_log=>{
    return usage_log.recycle_times
})

