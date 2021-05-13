module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',  {
    username: DataTypes.STRING(45),
    password: DataTypes.STRING(150),
  });
  User.associate = db => {
    db.User.hasMany(db.Message);
  };
  return User;
};
