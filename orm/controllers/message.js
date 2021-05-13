const db = require('../db/models/index');


exports.storeMessage = async (ctx, msg, authorId) => {
  const {content, timestamp, authorName} = msg;
  await db.Message.create({content, timestamp, UserId: authorId, messageFrom: authorId, authorName});
  ctx.status = 200;
  ctx.body = msg;
};

exports.getAllMessages = async (ctx, id) => {
  const allMessages = await db.Message.findAll();
  ctx.status = 200;
  ctx.body = allMessages;
};

exports.getAllMessagesNoRequest = async () => {
  const allMessages = await db.Message.findAll();
  return allMessages;
};
