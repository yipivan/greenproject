'use strict';
module.exports = (sequelize, DataTypes) => {
  var usage_log = sequelize.define('usage_log', {
    recycle_item_qty: DataTypes.INTEGER,
    recycle_times: DataTypes.INTEGER
  });
  usage_log.associate = function(models) {
    user_log.belongsTo(models.user);    
}
  return usage_log;
};