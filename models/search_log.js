'use strict';
module.exports = (sequelize, DataTypes) => {
  var search_log = sequelize.define('search_log', {
    query: DataTypes.STRING,
    location: DataTypes.GEOMETRY
  });
  search_log.associate =  function(models) {
    search_log.belongsTo(models.user);    
  }
  return search_log;
};