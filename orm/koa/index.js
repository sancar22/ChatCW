const koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const app = new koa();
const db = require('../db/models/index');
const router = require('./routes/serve');
const authRouter = require('./routes/auth');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const IO = require('koa-socket');
const io = new IO();

io.attach(app);

app.use(cors());
app.use(bodyParser());


app.use(router.routes()).use(router.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(serve(path.join(__dirname, '/../../client')));


io.on('message', async  (ctx, data) => {
  io.broadcast('message', {
    msg: data.msg
  });
});

(async function bootstrap () {
  await db.sequelize.sync();
  app.listen(3000);
})();
