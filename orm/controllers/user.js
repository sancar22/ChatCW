const db = require('../db/models/index');
const bcrypt = require('bcryptjs');

exports.registerUser = async (ctx, username, password) => {
  const users = await db.User.findAll({where:{username}});
  if (users.length>0) return ctx.body = 'User already exists!';
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  await db.User.create({username, password: hashedPass,});
  ctx.status = 201;
  ctx.body = 'User registered';
};

exports.loginUser = async (ctx, username, password) => {
  const user = await db.User.findOne({where:{username}});
  if (!user) return ctx.body = 'Wrong email or password!';
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return ctx.body ='Wrong email or password!';
  ctx.status = 200;
  ctx.body = user.id;
};

exports.getUserInfo = async (ctx, id) => {
  const user = await db.User.findOne({where:{id}});
  ctx.status = 200;
  ctx.body = user;
};
