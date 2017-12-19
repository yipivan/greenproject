"use strict";
module.exports = (sequelize, DataTypes) => {
  var search_log = sequelize.define("search_log", {
    query: DataTypes.STRING,
    location_lat: DataTypes.DECIMAL(9, 6),
    location_lng: DataTypes.DECIMAL(9, 6),
    userId: DataTypes.STRING
  });
  search_log.associate = function(models) {
    search_log.belongsTo(models.user);
  };
  return search_log;
};
