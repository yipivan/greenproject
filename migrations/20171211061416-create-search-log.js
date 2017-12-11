'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('search_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      query: {
        type: Sequelize.STRING
      },
      location_lat: {
        type: Sequelize.DECIMAL(9,6)
      },
      location_lng: {
        type: Sequelize.DECIMAL(9,6)
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
        'search_logs',
        'userId',
        {
          type: Sequelize.INTEGER,
          //allorNull: False
        }
      )
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('search_logs');
  }
};