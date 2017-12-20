module.exports = {
  isLoggedIn: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    console.log("user is not logged in");
    res.redirect('/login');
  }
}

