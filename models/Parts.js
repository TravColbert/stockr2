module.exports = function(Sequelize,app) {
  return {
    tablename:"parts",
    schema:{
      "partnum":{
        type: Sequelize.STRING,
        allowNull: false
      },
      "make":{
        type: Sequelize.STRING,
        allowNull: true
      },
      "description":{
        type: Sequelize.STRING,
        allowNull: true
      },
      "notes":{
        type: Sequelize.TEXT,
        allowNull: true
      },
      "cost":{
        type: Sequelize.DECIMAL
      },
      "price":{
        type: Sequelize.DECIMAL
      },
      "location":{
        type: Sequelize.STRING,
        allowNull: true
      },
      "mincount":{
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      "maxcount":{
        type: Sequelize.INTEGER
      },
      "inwarranty":{
        type: Sequelize.BOOLEAN
      },
    }
  }
}