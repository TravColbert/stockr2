module.exports = function(Sequelize,app) {
  return {
    tablename:"cases",
    schema:{
      "name":{
        type: Sequelize.STRING,
        allowNull: false
      },
      "description":{
        type: Sequelize.STRING,
        allowNull: true
      },
      "notes":{
        type: Sequelize.TEXT,
        allowNull: true
      }
    }
  }
}