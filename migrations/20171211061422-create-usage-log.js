'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usage_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recycle_item_qty: {
        type: Sequelize.INT
      },
      recycle_times: {
        type: Sequelize.INT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(()=>{
      return queryInterface.addColumn(
        'usage_logs',
        'userId',
        {
          type: Sequelize.INTEGER,
          //allowNull: False
        }
      )
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('usage_logs');
  }
};