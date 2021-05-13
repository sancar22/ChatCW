module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message',  {
    content: DataTypes.STRING(255),
    timestamp: DataTypes.STRING(100),
    messageFrom: DataTypes.INTEGER,
    authorName: DataTypes.STRING(100),
  });
  Message.associate = db => {
    db.Message.belongsTo(db.User, {
      onDelete: 'CASCADE',
      foreignKey: { allowNull: false }
    });
  };
  return Message;
};
