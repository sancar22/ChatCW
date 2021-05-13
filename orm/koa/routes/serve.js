const KoaRouter = require('koa-router');
const router = new KoaRouter();
const messageController = require('../../controllers/message');

router.post('/message', async ctx => {
  const {msg, myId} = ctx.request.body;
  const {content, authorId, timestamp} = msg;
  if (!content || !authorId || !timestamp) {
    ctx.status = 400;
    ctx.body = 'Invalid Message';
  }
  await messageController.storeMessage(ctx, msg, myId);
});

router.get('/message/:id',  async ctx => {
  const {id} = ctx.request.params;
  await messageController.getAllMessages(ctx, id);
});


module.exports = router;