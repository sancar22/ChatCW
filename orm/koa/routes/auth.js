const KoaRouter = require('koa-router');
const router = new KoaRouter({prefix: '/auth'});
const userController = require('../../controllers/user');


router.post('/login', async ctx => {
  const {username, password} = ctx.request.body;
  await userController.loginUser(ctx, username,password);
});

router.post('/register', async ctx => {
  const {username, password} = ctx.request.body;
  await userController.registerUser(ctx, username, password);
});

router.get('/userInfo/:id', async ctx => {
  const {id} = ctx.request.params;
  await userController.getUserInfo(ctx, id);
});

module.exports = router;