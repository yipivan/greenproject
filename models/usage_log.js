'use strict';
module.exports = (sequelize, DataTypes) => {
  var usage_log = sequelize.define('usage_log', {
    recycle_item_name: DataTypes.STRING,
    recycle_times: DataTypes.INTEGER,
    userId: DataTypes.STRING
  });
  usage_log.associate = function(models) {
    usage_log.belongsTo(models.user);    
}
  return usage_log;
};