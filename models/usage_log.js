'use strict';
module.exports = (sequelize, DataTypes) => {
  var usage_log = sequelize.define('usage_log', {
    recycle_item_qty: DataTypes.INTEGER,
    recycle_times: DataTypes.INTEGER,
    user_id: DataTypes.STRING
  });
  usage_log.associate = function(models) {
    usage_log.belongsTo(models.user);    
}
  return usage_log;
};