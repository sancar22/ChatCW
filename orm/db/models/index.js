const fs = require('fs');
const path = require('path');
const defaultConfig = require('../default.json');
const Sequelize = require('sequelize');


const config = {
  host: defaultConfig.host,
  dialect: 'mysql'
};

const sequelize = new Sequelize(defaultConfig.database, defaultConfig.user, defaultConfig.password, config);
const db =  {};

const files = fs.readdirSync(__dirname);

for (const file of files) {
  if (file !== 'index.js') {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
}

for (const model in db) {
  if (db[model].associate) db[model].associate(db);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

