'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING
  });
  user.associate = function(models){
    user.hasMany(models.search_log)
    user.hasOne(models.usage_log)
  }

  return user;
};